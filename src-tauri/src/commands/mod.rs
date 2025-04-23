pub mod file;
pub mod storage;

pub const fn bytes_to_gb(bytes: u64) -> f64 {
    bytes as f64 / 1_000_000_000.0
}