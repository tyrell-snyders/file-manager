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
            if (state.pathHistory[state.pathHistory.length - 1] !== action.payload) {
                state.pathHistory.push(action.payload);
                state.historyPlace = state.pathHistory.length - 1;
            }
            state.currentVolume = action.payload;
        },
        goBack: (state) => {
            if (state.historyPlace > 0) {
                state.historyPlace -= 1;
                state.currentVolume = state.pathHistory[state.historyPlace];
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
