import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
    pathHistory: string[];
    historyPlace: number;
    currentVolume: string;
}

const initialState: NavigationState = {
    pathHistory: [""],
    historyPlace: 0,
    currentVolume: "",
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        navigateTo: (state, action: PayloadAction<string>) => {
            // Push the new path only if it's different from the last one
            if (state.currentVolume === "") {
                // Reset history when navigating from ThisPC
                state.pathHistory = ["", action.payload];
                state.historyPlace = 1;
            } else {
                // Only update if navigating within the same volume
                if (state.currentVolume.split("\\")[0] === action.payload.split("\\")[0]) {
                    state.pathHistory.push(action.payload);
                    state.historyPlace = state.pathHistory.length - 1;
                } else {
                    // If navigating to a new volume, reset history
                    state.pathHistory = ["", action.payload];
                    state.historyPlace = 1;
                }
            }
            state.currentVolume = action.payload;
        },
        goBack: (state) => {
            if (state.historyPlace > 1) {
                state.historyPlace -= 1;
                state.currentVolume = state.pathHistory[state.historyPlace];
            } else {
                // Reset to ThisPC when reaching the first entry
                state.historyPlace = 0;
                state.currentVolume = "";
                state.pathHistory = [""];
            }
        },
        goForward: (state) => {
            if (state.historyPlace < state.pathHistory.length - 1) {
                state.historyPlace += 1;
                state.currentVolume = state.pathHistory[state.historyPlace];
            }
        },
    },
});

export const { navigateTo, goBack, goForward } = navigationSlice.actions;
export default navigationSlice.reducer;
