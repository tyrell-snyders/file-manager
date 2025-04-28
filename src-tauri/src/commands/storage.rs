use crate::utils::config::FileSystemCache;

use std::{ fs::Metadata, path::PathBuf };
use std::collections::HashMap;
use tauri::{Emitter, State};
use tokio::task;
use serde::{ Deserialize, Serialize };
use sysinfo::{ Disk, Disks };
use walkdir::{ DirEntry, WalkDir };

use super::bytes_to_gb;

#[derive(Serialize, Deserialize, Debug)]
pub struct Volume {
    pub name: String, 
    pub mountpoint: PathBuf,
    pub available_gb: f64, // Changed to f64 for precision
    pub used_gb: f64,      // Changed to f64 for precision
    pub total_gb: f64,     // Changed to f64 for precision
}

impl Volume {
    pub fn from(disk: &Disk) -> Self {
        let total_bytes_u64 = disk.total_space();
        let available_bytes_u64 = disk.available_space();
        let used_bytes_u64 = total_bytes_u64.saturating_sub(available_bytes_u64);

        
        let total_gb = bytes_to_gb(total_bytes_u64);
        let available_gb = bytes_to_gb(available_bytes_u64);
        let used_gb = bytes_to_gb(used_bytes_u64);


        Volume {
            name: disk.name().to_str().unwrap_or("Local Volume").to_string(),
            mountpoint: disk.mount_point().to_path_buf(),
            available_gb,
            used_gb,
            total_gb
        }
    }
}

#[tauri::command]
pub async fn get_volumes() -> Result<Vec<Volume>, ()> {
    let disks = Disks::new_with_refreshed_list();
    let volume = disks.iter()
        .map(|disk| {
            let v = Volume::from(disk);
            v
        }).collect();

    Ok(volume)
}

fn is_hidden(entry: &DirEntry) -> bool {
    entry.file_name()
        .to_str()
        .map(|s| s.starts_with("."))
        .unwrap_or(false)
}

#[tauri::command]
pub async fn list_files(path: String) -> Result<Vec<PathBuf>, String> {
    task::spawn_blocking(move || {
        let mut dir = vec![];
        for entry in std::fs::read_dir(&path)
            .map_err(|e| e.to_string())?
            .filter_map(Result::ok)
            .filter(|e| {
                e.file_name()
                    .to_str()
                    .map(|s| !s.starts_with("."))
                    .unwrap_or(false)
            })
        {
            dir.push(entry.path());
        }
        Ok(dir)
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Formats the Metadata as a string
fn metadata_to_string(metadata: &Metadata) -> String {
    format!("{:?}", metadata)
}

#[tauri::command]
pub async fn search_file(path: String, query: String) -> Result<Vec<PathBuf>, String> {
    task::spawn_blocking(move || {
        let mut files = vec![];
        for entry in WalkDir::new(path).into_iter().filter_entry(|e| !is_hidden(e)).filter_map(Result::ok) {
            if entry.file_name().to_str().unwrap().contains(&query) {
                files.push(entry.path().to_path_buf());
            }
        } 
        log::info!("{:?}", files);
        Ok(files)
    }).await
    .map_err(|e| e.to_string())?
}

/// Get the metadata of all the files in the path
#[tauri::command]
pub async fn get_files_metadata(path: String, state: State<'_, FileSystemCache>, app_handle: tauri::AppHandle) -> Result<HashMap<String, String>, String> {
    // First we check the cache before we get the new metadata
    let cache = state.inner();
    if let Some(chached_data) = cache.get(&path) {
        log::info!("Cache hit for path: {}", path);
        return Ok(chached_data);
    }
    // If the cache is empty, we get the new metadata
    log::info!("Cache miss for path: {}", path);

    let path_clone = path.clone();
    let meta_data: Result<HashMap<String, String>, String> = task::spawn_blocking(move || {
        let mut data = HashMap::new();
        let entries = std::fs::read_dir(&path_clone)
            .map_err(
                |e| format!("Failed to read directory '{}': {}", path_clone, e)
            )?;

        for entry_result in entries {
            match entry_result {
                Ok(entry) => {
                    match entry.metadata() {
                        Ok(metadata) => {
                            data.insert(
                                entry.file_name().to_string_lossy().to_string(),
                                metadata_to_string(&metadata) // Use the Ok value
                            );
                        }
                        Err(e) => {
                            // Failed to get metadata for this specific entry
                            log::warn!("Failed to get metadata for file/dir {:?} in '{}': {}", entry.path(), path_clone, e);
                            data.insert(
                                entry.file_name().to_string_lossy().to_string(),
                                format!("Error: {}", e)
                            );
                        }
                    }
                }
                Err(e) => {
                    log::warn!("Failed to process directory entry in '{}': {}", path_clone, e);
                }
            }
        }
        Ok(data)
    })
    .await
    .map_err(|e| e.to_string())?;

    // Insert the new metadata into the cache
    for retry in 0..3 {
        state.inner().insert(path.clone(), meta_data.clone().unwrap());
        if let Some(cached) = state.inner().get(&path) {
            if cached == meta_data.clone().unwrap() {
                break;
            }
        }
        tokio::time::sleep(tokio::time::Duration::from_millis(100 * (retry + 1))).await;
    }
    //Emit an event to the frontend to update the UI
    app_handle.emit("cache-updated", path).unwrap();
    Ok(meta_data?)
}