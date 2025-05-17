import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
    searchResults: string[];
    Error: string | null;
}

const initialState: SearchState = {
    searchResults: [],
    Error: null
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchResults: (state, action: PayloadAction<string[]>) => {
            state.searchResults = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.Error = action.payload;
        },
        returnState: (state) => {
            return state;
        }
    }
});

export const { setSearchResults, setError, returnState } = searchSlice.actions;
export default searchSlice.reducer;