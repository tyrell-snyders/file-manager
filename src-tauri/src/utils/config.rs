use serde::Deserialize;
use std::env;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub storage_path: PathBuf,
    pub max_size: u64, // This is in bytes
}

impl Config {
    pub fn new() -> Self {
        let storage_path = env::var("STORAGE_PATH")
            .map(PathBuf::from) // Convert String -> PathBuf
            .unwrap_or_else(|_| PathBuf::from("./storage"));

        let max_file_size = env::var("MAX_FILE_SIZE")
            .unwrap_or_else(|_| "52428800".to_string())
            .parse::<u64>()
            .expect("MAX FILE SIZE must be a valid number");

        // Enough storage directories
        if storage_path.exists()  {
            fs::create_dir(&storage_path).expect("Failed to create storage directory");
        }

        Config {
            storage_path,
            max_size: max_file_size
        }
    }
}