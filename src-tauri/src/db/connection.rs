use rusqlite::{ Connection, Result, params };
use std::{collections::HashMap, path::{ Path, PathBuf }};
use serde_json;

pub fn get_connection() -> Result<Connection> {
    let conn = Connection::open("./cache_DB.db")?;
    conn.execute("CREATE TABLE IF NOT EXISTS tblCache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dir_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        metadata TEXT NOT NULL,
        UNIQUE(dir_path, file_name)
    )", [])?;

    Ok(conn)
}

pub fn insert_cache(path: String, metadata: HashMap<String, String>, mut conn: Connection) {
    let tx = conn.transaction().unwrap();

    for (file_name, metadata) in metadata {
        let meta_json = serde_json::to_string(&metadata).unwrap();
        tx.execute(
            "INSERT OR REPLACE INTO tblCache (dir_path, file_name, metadata) VALUES (?1, ?2, ?3)", 
            params![path, file_name, meta_json]
        ).unwrap();
    }
    tx.commit().unwrap();
}