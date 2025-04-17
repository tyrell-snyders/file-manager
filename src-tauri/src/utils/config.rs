use crate::DB::connection;

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

    //TODO: Also implent sqlite to storethe metadata
    // update the cache and or cache every 1 hour while the application is running
    pub fn insert(&self, path: String, metadata: HashMap<String, String>) {
        // insert data into sqlite
        let connection = connection::get_connection().unwrap();
        connection::insert_cache(path.clone(), metadata.clone(), connection);

        let mut cache = self.cache.lock().unwrap();
        cache.put(path, metadata);
    }

    pub fn invalidate(&self, path: &str) {
        let mut cache = self.cache.lock().unwrap();
        cache.pop(path);
    }
}