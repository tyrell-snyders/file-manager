use chrono;
use rusqlite::{params, Connection, Result};
use serde_json;
use std::{collections::HashMap, error::Error};

pub fn get_connection() -> Result<Connection> {
    let conn = Connection::open("./sql/cache_DB.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tblCache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dir_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        metadata TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(dir_path, file_name)
    )",
        [],
    )?;

    Ok(conn)
}

pub fn insert_cache(
    path: String,
    metadata: HashMap<String, String>,
    mut conn: Connection,
) -> Result<(), Box<dyn Error>> {
    let tx = match conn.transaction() {
        Ok(tx) => tx,
        Err(e) => {
            log::error!("Transaction error: {:?}", e);
            return Err(Box::new(e));
        }
    };

    for (file_name, meta_value) in metadata {
        let meta_json = match serde_json::to_string(&meta_value) {
            Ok(json) => json,
            Err(e) => {
                log::error!("Failed to serialize metadata for {}: {:?}", file_name, e);
                continue;
            }
        };

        // Check if the file already exists
        let mut stmt = match tx
            .prepare("SELECT created_at FROM tblCache WHERE dir_path = ?1 AND file_name = ?2")
        {
            Ok(s) => s,
            Err(e) => {
                log::error!("Prepare statement failed for {}: {:?}", file_name, e);
                continue;
            }
        };

        let existing_created_at: Result<String, _> =
            stmt.query_row(params![path, file_name], |row| row.get(0));

        match existing_created_at {
            Ok(created_at_str) => {
                if let Ok(created_at_time) =
                    chrono::NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                {
                    let now = chrono::Local::now().naive_local();
                    let diff = now - created_at_time;

                    if diff.num_hours() < 1 {
                        continue;
                    }
                }

                if let Err(e) = tx.execute(
                    "UPDATE tblCache SET metadata = ?3, created_at = CURRENT_TIMESTAMP WHERE dir_path = ?1 AND file_name = ?2",
                    params![path, file_name, meta_json],
                ) {
                    log::error!("Failed to update cache for {}: {:?}", file_name, e);
                }
            }

            Err(_) => {
                if let Err(e) = tx.execute(
                    "INSERT INTO tblCache (dir_path, file_name, metadata) VALUES (?1, ?2, ?3)",
                    params![path, file_name, meta_json],
                ) {
                    log::error!(
                        "Failed to insert new cache entry for {}: {:?}",
                        file_name,
                        e
                    );
                }
            }
        }
    }

    match tx.commit() {
        Ok(_) => Ok(()),
        Err(e) => {
            log::error!("Failed to commit transaction: {:?}", e);
            Err(Box::new(e))
        }
    }
}
