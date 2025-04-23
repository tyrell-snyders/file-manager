use std::time::Duration;
use tokio::time;
use std::fmt::Debug;

/// Retry a database operation with exponential backoff.
pub async fn retry_db<F, T, E>(mut op: F, max_retries: usize) -> Result<T, E>
where 
    F: FnMut() -> Result<T, E>,
    E: Debug,
{
    let mut retries = 0;
    loop {
        match op()  {
            Ok(val) => return Ok(val),
            Err(e) if retries >= max_retries => return Err(e),
            Err(e) => {
                log::warn!("Retry {}/{} for DB op: {:#?}", retries + 1, max_retries, e);
                retries += 1;
                time::sleep(Duration::from_millis(100 * retries as u64)).await;
            }
        }
    }
}