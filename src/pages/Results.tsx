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

    /*
    * TODO: Separate the file/folder names from the directory path. Just make it look visually better insteqad of clutter.
    * */
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow m-6">
                <button onClick={handleBackButton}>Back</button>
                <h1 className="mb-10">Results</h1>
                <p>Search results:</p>
                <div className="vh-100 grid md:grid-cols-2 lg:grid-cols-3">
                    
                    
                    {state && state.searchResult.length > 0 && state.searchResult.map((r, i) => (
                        <button key={i} className="m-2 border-2 border-gray-400 p-10 rounded-md">
                            <p>{r}</p>
                        </button>

                    ))}
                </div>
            </div>
        </div>
    )
}