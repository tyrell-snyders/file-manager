use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tokio::task;
use sysinfo::{Disk, Disks };

use super::bytes_to_gb;

#[derive(Serialize, Deserialize, Debug)]
pub struct Volume {
    name: String, 
    mountpoint: PathBuf,
    available_gb: u16,
    used_gb: u16,
    total_gb: u16,
}

impl Volume {
    fn from(disk: &Disk) -> Self {
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

/// Retrieves a list of mounted drives on the system.
///
/// This function uses the `tokio::task::spawn_blocking` to spawn a blocking task that fetches the list of mounted drives.
/// It utilizes the `sysinfo::Disks` struct to retrieve the drive information.
///
/// # Returns
///
/// A `Vec<String>` containing the mount points of the mounted drives.
///
/// # Errors
///
/// If an error occurs while fetching the drives, it will return an error message as a string.
#[tauri::command]
pub async fn get_drives() -> Vec<String> {
    let drives = task::spawn_blocking(|| {
        let mut disks = Disks::new();
        disks.refresh(true);

        disks
            .list()
            .iter()
            .map(|disk| disk.mount_point().display().to_string())
            .collect::<Vec<_>>()
    })
    .await
    .expect("Failed to fetch drives");

    drives

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