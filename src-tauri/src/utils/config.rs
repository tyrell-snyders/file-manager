use crate::db::db_connection;

use lru::LruCache;
use serde::Deserialize;
use std::{
    collections::HashMap,
    env,
    fs,
    num::NonZeroUsize,
    path::PathBuf,
    sync::{Arc, Mutex},
};


#[derive(Debug, Deserialize)]
pub struct Config {
    pub storage_path: PathBuf,
    pub max_size: u64, // This is in bytes
}

impl Config {
    pub fn new() -> Self {
        let storage_path = env::var("STORAGE_PATH")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from("./storage"));

        let max_file_size = env::var("MAX_FILE_SIZE")
            .unwrap_or_else(|_| "52428800".to_string())
            .parse::<u64>()
            .expect("MAX FILE SIZE must be a valid number");

        if !storage_path.exists() {
            fs::create_dir(&storage_path).expect("Failed to create storage directory");
        }

        Config {
            storage_path,
            max_size: max_file_size,
        }
    }
}

#[derive(Clone)]
pub struct FileSystemCache {
    pub cache: Arc<Mutex<LruCache<String, HashMap<String, String>>>>,
}

impl FileSystemCache {
    pub fn new(capacity: usize) -> Result<Self, String> {
        let non_zero_capacity = NonZeroUsize::new(capacity)
            .ok_or_else(|| "Cache capacity must be greater than zero".to_string())?;

        Ok(FileSystemCache {
            cache: Arc::new(Mutex::new(LruCache::new(non_zero_capacity))),
        })
    }

    pub fn get(&self, path: &str) -> Option<HashMap<String, String>> {
        let mut cache = self.cache.lock().unwrap();
        cache.get(path).cloned()
    }

    pub fn insert(&self, path: String, metadata: HashMap<String, String>) {
        if path.contains("$Recycle.Bin") || path.contains("System Volume Information") {
            return;
        }

        let mut cache = self.cache.lock().unwrap();
        cache.put(path, metadata);
    }

}
