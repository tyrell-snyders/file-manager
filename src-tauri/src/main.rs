// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod utils;
pub mod commands;
pub mod DB;

fn main() {
    file_manager_lib::run()
}
