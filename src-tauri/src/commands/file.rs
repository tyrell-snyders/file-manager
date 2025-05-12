use std::{ fs::{ metadata, FileType }, io::Result, path::PathBuf, time::SystemTime };
use thiserror::Error;
use tokio::task;

use super::storage::search_file;

#[derive(serde::Serialize)]
struct Mtd {
    name: String,
    size: u64,
    is_file: bool,
    is_symlink: bool,
    #[serde(skip)]
    file_type: FileType,
    is_dir: bool,
    path: String,
    created_at: SystemTime,
    modified_at: SystemTime
}

impl Mtd {
    /// Creates a new Mtd instance.
    fn new(name: String, size: u64, is_file: bool, is_symlink: bool, file_type: FileType, is_dir: bool, path: String, created_at: SystemTime, modified_at: SystemTime) -> Self {
        Self {
            name,
            size,
            is_file,
            is_symlink,
            file_type,
            is_dir,
            path,
            created_at,
            modified_at
        }
    }

    /// Creates a new Mtd instance from a PathBuf.
    fn from_path(path: PathBuf) -> Result<Self> {
        let metadata = metadata(path.clone())?;
        let file_type = metadata.file_type();
        let is_file = file_type.is_file();
        let is_symlink = file_type.is_symlink();
        let is_dir = file_type.is_dir();
        let name = path.file_name().unwrap().to_str().unwrap().to_string();
        let size = metadata.len();
        let created_at = metadata.created()?;
        let modified_at = metadata.modified()?;
        Ok(Self::new(name, size, is_file, is_symlink, file_type, is_dir, path.to_str().unwrap().to_string(), created_at, modified_at))
    }

    /// Converts the Mtd instance to a JSON string.
    fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap()
    }
}

#[derive(Error, Debug, serde::Serialize)]
pub enum MetadataError {
    #[error("IO error: {0}")]
    IoError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}

impl From<std::io::Error> for MetadataError {
    fn from(err: std::io::Error) -> Self {
        MetadataError::IoError(err.to_string())
    }
}

#[tauri::command]
/// Gets the metadata of a file or directory.
/// * `path` - The path to the file or directory.
/// * `filename` - The name of the file or directory.
/// # Returns
/// * `String` - The metadata of the file or directory.
/// # Errors
/// * `Error` - If the file or directory does not exist.
/// # Examples
/// ```
/// let metadata = get_metadata("/home/user/file.txt", "file.txt").await.unwrap();
/// println!("{}", metadata);
/// ```

pub async fn get_metadata(path: String, filename: String) -> std::result::Result<String, MetadataError> {
    let file = search_file(path.clone(), filename.clone()).await.unwrap();
    if file.is_empty() {
        log::error!("File not found: {}", filename);
        return Err(MetadataError::UnexpectedError(format!("File not found: {}", filename)));
    }

    let file_path = file.get(0).unwrap();

    log::info!("File path: {:?}", file_path);

    // let file_metadata = metadata(file_path).unwrap();
    let result = Mtd::from_path(file_path.clone()).unwrap().to_json();
    log::info!("Result: {}", result);
    // log::info!("File metadata: {:?}", file_metadata);
    // let mut dir = vec![];
    // let file_path_clone = file_path.clone();
    // let result = task::spawn_blocking(move || {
    //     let file_type = file_metadata.file_type();
    //     if file_type.is_dir() {
    //         for entry in std::fs::read_dir(path.clone()).unwrap() {
    //             let entry = entry.unwrap();
    //             let path = entry.path();
    //             let metadata = Mtd::from_path(path).unwrap();
    //             dir.push(metadata.to_json());
    //         }
    //     } else {
    //         let metadata = Mtd::from_path(file_path_clone).unwrap();
    //         dir.push(metadata.to_json());
    //     }

    //     Ok(serde_json::to_string(&dir).unwrap())
    // }).await.unwrap();

    Ok(result)
}