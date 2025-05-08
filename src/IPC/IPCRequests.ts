import { invoke } from "@tauri-apps/api/core";
import { Volume, FileMetadata } from "../types";


export const get_volumes = async () => await invoke<Volume[]>("get_volumes");
export const list_files = async (volumePath: string) => 
    await invoke<string[]>("list_files", { path: volumePath });
export const get_metadata = async (volumePath: string) =>
    await invoke<FileMetadata>("get_files_metadata", { path: volumePath });
export const search_files = async (path: string, query: string) =>
    await invoke<string[]>("search_file", { path, query });
export const get_mtd = async(path: string, filaname: string) => 
    await invoke<string>("get_metadata", { path, filename: filaname });