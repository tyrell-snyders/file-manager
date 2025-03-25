import { invoke } from "@tauri-apps/api/core";
import { Volume, FileMetadata } from "../types";


export const get_volumes = async () => await invoke<Volume[]>("get_volumes");
export const list_files = async (volumePath: string) => 
    await invoke<string[]>("list_files", { path: volumePath });
export const get_files_metadata = async (volumePath: string) =>
    await invoke<string[]>("get_files_metadata", { path: volumePath });
export const get_metadata = async (volumePath: string) =>
    await invoke<FileMetadata>("file_list", { path: volumePath });