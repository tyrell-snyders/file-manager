use std::fs::OpenOptions;
use log::{LevelFilter, SetLoggerError};
use simplelog::*;

pub fn init_logger() -> Result<(), SetLoggerError> {
    let log_file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("/src-tauri/logs/app.log")
    .expect("Failed to open log file");
    
    CombinedLogger::init(vec![
        TermLogger::new(
            LevelFilter::Info,
            Config::default(),
            TerminalMode::Mixed,
            ColorChoice::Auto
        ),
        WriteLogger::new(
            LevelFilter::Debug,
            Config::default(),
            log_file
        ),
    ])
}