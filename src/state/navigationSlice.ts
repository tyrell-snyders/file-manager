import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
    pathHistory: string[];
    historyPlace: number;
}

const initialState: NavigationState = {
    pathHistory: [],  // Keep only the history
    historyPlace: 0,
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        navigateTo: (state, action: PayloadAction<string>) => {
            // Remove any future history if we're not at the end
            if (state.historyPlace < state.pathHistory.length - 1) {
                state.pathHistory = state.pathHistory.slice(0, state.historyPlace + 1);
            }
            state.pathHistory.push(action.payload);
            state.historyPlace = state.pathHistory.length - 1;
        },
        goBack: (state) => {
            if (state.historyPlace > 0) {
                state.historyPlace -= 1;
            }
        },
        goForward: (state) => {
            if (state.historyPlace < state.pathHistory.length - 1) {
                state.historyPlace += 1;
            }
        },
        setHistoryPlace: (state, action: PayloadAction<number>) => {
            state.historyPlace = action.payload;
        },
    },
});

export const { navigateTo, goBack, goForward, setHistoryPlace } = navigationSlice.actions;
export default navigationSlice.reducer;