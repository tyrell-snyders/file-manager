use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

use crate::db::models::FileFolder;



pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").
        expect("DATABASE_URL must be set in .env file");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn get_filefolders(conn: &mut SqliteConnection, qFilter: String) -> QueryResult<Vec<FileFolder>> {
    use crate::db::schema::file_folders::dsl::*;

    let connection = &mut self::establish_connection();
    let res = file_folders
        .limit(1)
        .filter(name.like(format!("%{}%", qFilter)))
        .select(FileFolder::as_select())
        .load::<FileFolder>(connection)
    .expect("Error loading file folders");

    Ok(res)
}