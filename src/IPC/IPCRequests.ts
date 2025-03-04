import { invoke } from "@tauri-apps/api/core";
import { Volume } from "../types";

export const get_volumes = async () => await invoke<Volume[]>("get_volumes");
