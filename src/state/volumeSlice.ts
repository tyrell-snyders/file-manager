import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Volume } from "../types";

interface VoluemState {
    currentVolume: string;
    currentDirectoryPath: string;
    volumes: Volume[];
}

const initialState: VoluemState = {
    currentVolume: "",
    currentDirectoryPath: "",
    volumes: []
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
    },
});

export const { setCurrentVolume, setCurrentDirectoryPath, setVolumes } = volumeSlice.actions;
export default volumeSlice.reducer;