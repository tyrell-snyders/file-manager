import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VoluemState {
    currentVolume: string;
    currentDirectoryPath: string;
}

const initialState: VoluemState = {
    currentVolume: "",
    currentDirectoryPath: ""
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
        }
    },
});

export const { setCurrentVolume, setCurrentDirectoryPath } = volumeSlice.actions;
export default volumeSlice.reducer;