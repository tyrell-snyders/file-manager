import { useState } from "react";
import { DirectoryContent } from "../types";

export default function useNavigation(
    searchResults: DirectoryContent[],
    setSearcResults: Function
) {
    const [pathHistory, setPathHistory] = useState([""])
    const [historyPlace, setHistoryPlace] = useState(0)
    const [currentVolume, setCurrentVolume] = useState("")

    const onBackArrowClick = () => {
        if (searchResults.length > 0) {
            setHistoryPlace(historyPlace)

            setSearcResults([]);
            return;
        }

        pathHistory.push(pathHistory[historyPlace - 1]);
        setHistoryPlace((prev) => prev - 1);
    }

    const onForwardArrowClick = () =>  setHistoryPlace((prev) => prev + 1);
    const canGoForward = (): boolean => historyPlace < pathHistory.length - 1; 
    const canGoBack = (): boolean => historyPlace > 0;

    return {
        pathHistory,
        setPathHistory,
        historyPlace,
        setHistoryPlace,
        onBackArrowClick,
        onForwardArrowClick,
        canGoForward,
        canGoBack,
        currentVolume,
        setCurrentVolume,

    }

}