import { createAsyncThunk } from "@reduxjs/toolkit";
import { get_volumes, list_files } from "../../IPC/IPCRequests";

export const fetchVolumes = createAsyncThunk(
    'volume/fetch-volumes',
    async () => await get_volumes()
)

export const fetchVolumeContent = createAsyncThunk(
    'volume/fetchContent',
    async (volumePath: string) => await list_files(volumePath)
)