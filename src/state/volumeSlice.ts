import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Volume } from "../types";

interface VoluemState {
    currentVolume: string;
    currentDirectoryPath: string;
    volumes: Volume[];
    volume: Content[];
}

interface Content {
    path: string;
}
const initialState: VoluemState = {
    currentVolume: "",
    currentDirectoryPath: "",
    volumes: [],
    volume: [],
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
        }
    },
});

export const { setCurrentVolume, setCurrentDirectoryPath, setVolumes, setVolume } = volumeSlice.actions;
export default volumeSlice.reducer;