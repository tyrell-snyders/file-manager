export interface Volume {
    name: string;
    mountpoint: string;
    available_gb: number;
    used_gb: number;
    total_gb: number;
}

export type DirectoryEntityType = "file" | "directory"
export type DirectoryContentType = "File" | "Directory"

export enum ContextMenuType {
    None,
    General,
    DirectoryEntity
}

export interface SystemTime {
    secs_since_epoch: number;
    nanos_since_epoch: number;
}

export interface Mtd {
    name: String,
    size: number,
    is_file: boolean,
    is_symlink: boolean,
    file_type: string,
    is_dir: boolean,
    path: String,
    created_at: SystemTime,
    modified_at: SystemTime
}