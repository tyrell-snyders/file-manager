import { invoke } from "@tauri-apps/api/core";
import { Volume } from "../types";


export const get_volumes = async () => await invoke<Volume[]>("get_volumes");
export const list_files = async (volumePath: string) => 
    await invoke<string[]>("list_files", { path: volumePath });