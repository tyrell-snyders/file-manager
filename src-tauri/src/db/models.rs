use diesel::prelude::*;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::db::schema::file_folders)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct FileFolder {
    pub id: i32,
    pub path: String,
    pub name: String,
}

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::db::schema::metadata)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Metadata {
    pub id: i32,
    pub file_id: i32,
    pub size: i32,
    pub is_dir: bool,
    pub accessed_at: chrono::NaiveDateTime,
    pub created_at: chrono::NaiveDateTime,
    pub modified_at: chrono::NaiveDateTime
}