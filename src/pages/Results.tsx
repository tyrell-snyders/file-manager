import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import useNavigation from "../hooks/useNavigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { setCurrentVolume } from "../state/volumeSlice";

interface State {
    searchResult: string[],
    currentDirectoryPath: string,
    currentVolume: string,
    currentPlace: string | undefined
}

export default function Results() {
    const navigation = useNavigate();
    const { navigate, goHome } = useNavigation();
    const [loading, setLoading] = useState(false);
    const state: State = useLocation().state;
    const dispatch = useDispatch();
    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume);


    useEffect(() => {
        console.log("State", state);
    }, [state])

    const handleBackButton = () => {
        // navigate(currentVolume)
        navigation('/');
        goHome();
    }

    useEffect(() => {
        console.log("Current Volume", currentVolume);
    }, [currentVolume])

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