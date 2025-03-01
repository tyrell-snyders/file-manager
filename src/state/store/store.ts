import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "../navigationSlice";
import volumeReducer from "../volumeSlice";
import searchReducer from "../searchSlice"
export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        volume: volumeReducer,
        search: searchReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;