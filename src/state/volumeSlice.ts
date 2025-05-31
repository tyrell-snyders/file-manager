import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mtd, Volume } from "../types";

interface VolumeState {
    currentVolume: string;
    currentDirectoryPath: string;
    volumes: Volume[];
    volume: Content[];
    metadata: Mtd;
}

interface Content {
    path: string;
}
const initialState: VolumeState = {
    currentVolume: "",
    currentDirectoryPath: "",
    volumes: [],
    volume: [],
    metadata: {} as Mtd,
}
const volumeSlice = createSlice({
    name: "volume",
    initialState,
    reducers: {
        setCurrentVolume: (state, action: PayloadAction<string>) => {
            state.currentVolume = action.payload;
        },
        setCurrentDirectoryPath: (state, action: PayloadAction<string>) => {
            state.currentDirectoryPath = action.payload;
        },
        setVolumes: (state, action: PayloadAction<Volume[]>) => {
            state.volumes = action.payload;
        },
        setVolume: (state, action: PayloadAction<string[]>) => {
            state.volume = action.payload.map((path) => ({ path }));
        },
        setMetadata: (state, action: PayloadAction<Mtd>) => {
            state.metadata = action.payload;
        }
    },
});

export const { setCurrentVolume, setVolumes, setVolume, setMetadata } = volumeSlice.actions;
export default volumeSlice.reducer;