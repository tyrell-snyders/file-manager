use std::{path, thread};
use tokio::{fs, task};
use sysinfo::{ DiskRefreshKind, Disks };

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