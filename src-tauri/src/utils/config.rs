use crate::db::db_connection;

use lru::LruCache;
use serde::Deserialize;
use std::{ collections::HashMap, env, fs, num::NonZeroUsize, path::PathBuf, sync::{ Arc, Mutex } };


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

#[derive(Clone)]
pub struct FileSystemCache {
    pub cache: Arc<Mutex<LruCache<String, HashMap<String, String>>>>, //String = directroy path, Hash<pa = fileName ->  metadata
}

impl FileSystemCache {
    pub fn new(capacity: usize) -> Result<Self, String> {
        // Not going to lie I use AI to solve the NonZeroUsize here, because LruCacahe only accepts NonZeroUsize
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
        // skip certain directories
        if path.contains("$Recycle.Bin") || path.contains("System Volume Information") {
            log::info!("Skipping system folder: {}", path);
            return;
        }

        let connection = match db_connection::get_connection() {
            Ok(conn) => conn,
            Err(e) => {
                log::error!("DB connection error: {:?}", e);
                return;
            }
        };

        if let Err(e) = db_connection::insert_cache(path.clone(), metadata.clone(), connection) {
            log::error!("Failed to insert into cache DB for path {}: {:?}", path, e);
            return;
        }

        let mut cache = self.cache.lock().unwrap();
        cache.put(path, metadata);
    }

    pub fn invalidate(&self, path: &str) {
        let mut cache = self.cache.lock().unwrap();
        cache.pop(path);
    }
}