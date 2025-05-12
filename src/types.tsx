export interface Volume {
    name: string;
    mountpoint: string;
    available_gb: number;
    used_gb: number;
    total_gb: number;
}

export type DirectoryEntityType = "file" | "directory"
export type DirectoryContentType = "File" | "Directory"

export interface DirectoryContent {
    [key: string]: [string, string]
}

export interface FileMetadata {
    [filename: string]: string
}

export interface FileInfo {
    name: string;
    type: 'file' | 'directory' | 'symlink' | 'unkwown';
    size: number;
}

export enum ContextMenuType {
    None,
    General,
    DirectoryEntity
}

export interface Mtd {
    name: String,
    size: number,
    is_file: boolean,
    is_symlink: boolean,
    file_type: string,
    is_dir: boolean,
    path: String,
    created_at: Date,
    modified_at: Date
}