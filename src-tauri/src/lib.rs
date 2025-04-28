#[macro_use]
extern crate lazy_static;

use tauri;
mod commands;
mod utils;
mod db;

use commands::storage::{ get_volumes, list_files, search_file, get_files_metadata };
use utils::config::FileSystemCache;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
                ]).build(tauri::generate_context!())
                .expect("error while building tauri application")
                .run(|app_handle, event| {
                    match event {
                        tauri::RunEvent::Ready => {
                            log::info!("Application Started");
                        }
                        tauri::RunEvent::MainEventsCleared => {
                            log::info!("Main Events Cleared");
                           
                        }
                        _ => {}
                    }
                });  
        }
        Err(err) => {
            log::error!("Error creating cache: {}", err);
            std::process::exit(1);
        }
    }
}
