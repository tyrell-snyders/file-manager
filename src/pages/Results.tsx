import { useEffect } from "react";
import { useLocation, useNavigate as useRouterNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCurrentVolume } from "../state/volumeSlice";
import { setSearchResults } from "../state/searchSlice";

interface State {
    searchResult: string[],
    currentDirectoryPath: string,
    currentVolume: string,
    currentPlace: string | undefined
}

export default function Results() {
    const routerNavigate = useRouterNavigate();
    const location = useLocation();
    const state: State = location.state;
    const dispatch = useDispatch();

    useEffect(() => {
        if (state && state.currentVolume) {
            dispatch(setCurrentVolume(state.currentVolume));
        }
    }, [state, dispatch]);

    /**
    * First, it clears the search results in the Redux store
    * Then, it navigates back to the home page using the routerNavigate function
    */
    const handleBackButton = () => {
        dispatch(setSearchResults([]));
        routerNavigate('/');
        if (state && state.currentVolume) {
            dispatch(setCurrentVolume(state.currentVolume));
        }
    }

    return (
        <div>
            <button onClick={handleBackButton}>Back</button>
            <h1>Results</h1>
            <p>Search results:</p>
            {state && state.searchResult.length > 0 && state.searchResult.map((r, i) => (
                <div key={i}>
                    <p>{r}</p>
                </div>
            ))}
        </div>
    )
}