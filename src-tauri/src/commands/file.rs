use std::{ any::Any, fs::{ metadata, File, FileType }, io::{Error, Result}, path::PathBuf, time::SystemTime };
use thiserror::Error;
use tauri::{Emitter, State};
use crate::{db::db_connection::get_filefolders, utils::config::FileSystemCache};
use crate::db::models::*;
use diesel::prelude::*;
use crate::db::db_connection;
use chrono::{DateTime, Utc};

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
pub enum FileError {
    #[error("IO error: {0}")]
    IoError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}

impl From<std::io::Error> for FileError {
    fn from(err: std::io::Error) -> Self {
        FileError::IoError(err.to_string())
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

pub async fn get_metadata(path: String, filename: String) -> std::result::Result<String, FileError> {
        
    let file = search_file(path.clone(), filename.clone()).await.unwrap();
    if file.is_empty() {
        log::error!("File not found: {}", filename);
        return Err(FileError::UnexpectedError(format!("File not found: {}", filename)));
    }

    let file_path = file[0].clone();
   
    // let file_metadata = metadata(file_path).unwrap();
    let result = Mtd::from_path(file_path.clone().clone()).unwrap().to_json();
    log::info!("Result: {}", result);

    // Add data to db
    let mut conn = db_connection::establish_connection();
    let _res = tokio::task::spawn_blocking(move || {
        let new_metadata = Mtd::from_path(file_path.clone().clone()).unwrap();
        use crate::db::schema::*;
        let new_file = NewFileFolder { name: new_metadata.name.clone(), path: path.clone() };
        diesel::insert_into(file_folders::table)
            .values(&new_file)
            .execute(&mut conn)
            .expect("Error inserting new file folder");

        let fileDB = get_filefolders(&mut conn, new_file.name.clone());
        let file = fileDB.unwrap().into_iter().next().expect("File not found in DB");
        let new_mtd = NewMetadata {
            file_id: file.id,
            size: new_metadata.size as i32,
            is_dir: new_metadata.is_dir,
            created_at: DateTime::<Utc>::from(new_metadata.created_at).naive_utc(),
            modified_at: DateTime::<Utc>::from(new_metadata.modified_at).naive_utc(),
            accessed_at: DateTime::<Utc>::from(SystemTime::now()).naive_utc(), // Assuming accessed_at is the current time
        };

        diesel::insert_into(metadata::table)
            .values(&new_mtd)
            .execute(&mut conn)
            .expect("Error inserting new metadata");
    }).await.map_err(|e| {
        log::error!("Failed to insert metadata into database: {}", e);
        FileError::UnexpectedError("Failed to insert metadata into database".to_string())
    })?;

    Ok(result)
}

#[tauri::command]
pub async fn create_folder(path: String, dir_name: String) -> std::result::Result<String, FileError> {
    let folder_path = PathBuf::from(path).join(&dir_name);
    match std::fs::create_dir(folder_path.clone()) {
        Ok(_) => {
            log::info!("Directory created successfully at: {}", folder_path.display());
            Ok("Directory created successfully".to_string())
        },
        Err(err) => {
            log::error!("Failed to create directory at: {}", folder_path.display());
            Err(FileError::IoError(err.to_string()))
        }
    }
}