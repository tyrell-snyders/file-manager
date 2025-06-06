use rusqlite::{params, Connection, Result};
use std::{collections::HashMap, sync::{Arc, Mutex}};

lazy_static::lazy_static! {
    static ref CONNECTION_POOL: Arc<Mutex<Option<Connection>>> = Arc::new(Mutex::new(None));
}

pub fn get_connection() -> Result<Connection> {
    let mut pool = CONNECTION_POOL.lock().unwrap();
    if let Some(conn) = pool.take() {
        return Ok(conn);
    }
    
    let conn = Connection::open("./sql/cache_DB.db")?;
    conn.execute_batch(
        "PRAGMA journal_mode=WAL;
         PRAGMA busy_timeout=5000;
         CREATE TABLE IF NOT EXISTS tblCache (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             dir_path TEXT NOT NULL,
             file_name TEXT NOT NULL,
             metadata TEXT NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             UNIQUE(dir_path, file_name)
         )"
    )?;
    
    Ok(conn)
}

pub fn return_connection(conn: Connection) {
    let mut pool = CONNECTION_POOL.lock().unwrap();
    *pool = Some(conn);
}

pub fn insert_cache(
    path: String,
    metadata: HashMap<String, String>,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut retries = 0;

    let conn = get_connection()?;
    let tx = conn.unchecked_transaction()?;  // Use unchecked for better performance
    
    for (file_name, meta_value) in metadata {
        let meta_json = serde_json::to_string(&meta_value)?;
        
        tx.execute(
            "INSERT OR REPLACE INTO tblCache 
             (dir_path, file_name, metadata) 
             VALUES (?1, ?2, ?3)",
            params![path, file_name, meta_json],
        )?;
    }
    
    match tx.commit() {
        Ok(_) => {
            return_connection(conn);
            return Ok(());
        },
        Err(e) if retries >= 3 => return Err(e.to_string().into()),
        Err(e) => {
            log::error!("Transaction failed, retrying... ({}/{})", retries, 3);
            retries += 1;
            let _ = tokio::time::sleep(tokio::time::Duration::from_millis(100 * retries));
            Ok(())
        }
    }
}