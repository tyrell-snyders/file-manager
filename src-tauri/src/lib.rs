use tauri;
mod commands;
mod utils;
mod db;

use commands::storage::{ get_volumes, list_files, search_file, get_files_metadata };
use utils::{config::FileSystemCache, logger};


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    logger::init_logger();
    let cache_result = FileSystemCache::new(100);
    match cache_result {
        Ok(cache) => {
            tauri::Builder::default()
                .manage(cache)
                .plugin(tauri_plugin_opener::init())
                .invoke_handler(tauri::generate_handler![
                    get_volumes, 
                    list_files, 
                    search_file,
                    get_files_metadata
                ])
                .run(tauri::generate_context!())
            .expect("error while running tauri application");
        }
        Err(err) => {
            log::error!("Error creating cache: {}", err);
            std::process::exit(1);
        }
    }
}
