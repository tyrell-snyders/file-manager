use crate::utils::config::FileSystemCache;

use std::{fs::Metadata, path::PathBuf};
use std::collections::HashMap;
use tauri::State;
use tokio::task;
use serde::{ Deserialize, Serialize };
use sysinfo::{ Disk, Disks };
use walkdir::{ DirEntry, WalkDir };

use super::bytes_to_gb;

#[derive(Serialize, Deserialize, Debug)]
pub struct Volume {
    pub name: String, 
    pub mountpoint: PathBuf,
    pub available_gb: u16,
    pub used_gb: u16,
    pub total_gb: u16,
}

impl Volume {
    pub fn from(disk: &Disk) -> Self {
        let used_bytes = disk.total_space() - disk.available_space();
        let available_gb = bytes_to_gb(disk.available_space());
        let used_gb  = bytes_to_gb(used_bytes);
        let total_gb = bytes_to_gb(disk.total_space());

        let name = {
            let volume_name = disk.name().to_str().unwrap();
            match volume_name.is_empty() {
                true => "Local Volume",
                false => &volume_name
            }.to_string()
        };

        let mountpoint = disk.mount_point().to_path_buf();
        Self {
            name,
            available_gb,
            used_gb,
            total_gb,
            mountpoint
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

// Formats the Metadata as a string
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
        println!("{:?}", files);
        Ok(files)
    }).await
    .map_err(|e| e.to_string())?
}

// Get the metadata of all the files in the path
#[tauri::command]
pub async fn get_files_metadata(path: String, state: State<'_, FileSystemCache>) -> Result<HashMap<String, String>, String> {
    // First we check the cache before we get the new metadata
    let cache = state.inner();
    if let Some(chached_data) = cache.get(&path) {
        println!("Cache hit for path: {}", path);
        return Ok(chached_data);
    }
    // If the cache is empty, we get the new metadata
    println!("Cache miss for path: {}", path);

    let path_clone = path.clone();
    let meta_data: Result<HashMap<String, String>, String> = task::spawn_blocking(move || {
        let mut data = HashMap::new();
        for entry in std::fs::read_dir(&path_clone)
            .map_err(|e| e.to_string())?
            .filter_map(Result::ok)
        {
            data.insert(
                entry.file_name().to_string_lossy().to_string(), 
                metadata_to_string(&entry.metadata().unwrap())
            );
        }
        
        Ok(data)
    })
    .await
    .map_err(|e| e.to_string())?;

    // Insert the new metadata into the cache
    cache.insert(path, meta_data.clone()?);
    Ok(meta_data?)
}