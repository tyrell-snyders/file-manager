// @generated automatically by Diesel CLI.

diesel::table! {
    file_folders (id) {
        id -> Integer,
        path -> Text,
        name -> Text,
    }
}

diesel::table! {
    metadata (id) {
        id -> Integer,
        file_id -> Integer,
        size -> Integer,
        is_dir -> Bool,
        accessed_at -> Timestamp,
        created_at -> Timestamp,
        modified_at -> Timestamp,
    }
}

diesel::joinable!(metadata -> file_folders (file_id));

diesel::allow_tables_to_appear_in_same_query!(
    file_folders,
    metadata,
);
