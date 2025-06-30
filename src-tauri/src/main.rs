// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use utils::logger;
pub mod utils;
pub mod commands;
pub mod db;


fn main() {
    let _ = logger::init_logger();
    file_manager_lib::run()
}