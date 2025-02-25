use std::error::Error;

pub mod file;
pub mod storage;

pub type FError = Box<dyn Error + Send + Sync + 'static>;
pub type FResult<T> = Result<T, FError>;

pub const fn bytes_to_gb(bytes: u64) -> u16 {
    (bytes / (1e+9 as u64)) as u16
}