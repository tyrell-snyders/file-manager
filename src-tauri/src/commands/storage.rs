use std::path::PathBuf;
use tokio::task;
use serde::{ Deserialize, Serialize };
use sysinfo::{ Disk, Disks };
use walkdir::WalkDir;

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

    println!("{:?}", volume);

    Ok(volume)
}

#[tauri::command]
pub async fn list_files(path: String) -> Result<Vec<PathBuf>, String> {
    task::spawn_blocking(move || {
        let mut dir = vec![];
        for entry in WalkDir::new(path) {
            let entry = entry.map_err(|e| e.to_string())?;
            dir.push(entry.path().to_path_buf());
        }
        Ok(dir)
    })
    .await
    .map_err(|e| e.to_string())?
}