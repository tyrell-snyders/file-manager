import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { navigateTo, goBack, goForward, setHistoryPlace } from "../state/navigationSlice";
import { setCurrentVolume } from '../state/volumeSlice';

export default function useNavigation() {
    const dispatch = useDispatch()
    const { pathHistory, historyPlace } = useSelector((state: RootState) => state.navigation);
    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume);


    const onBackArrowClick = () => {
        console.log("History Place", historyPlace);
        dispatch(goBack());
        // After going back, update currentVolume from the history
        if (historyPlace > 0) {
            dispatch(setCurrentVolume(pathHistory[historyPlace - 1]));
            console.log("Current Volume Nigga", pathHistory[historyPlace - 1]);
        } else {
            dispatch(setCurrentVolume(""));
        }
    };

    const onForwardArrowClick = () => {
        dispatch(goForward());
        // After going forward, update currentVolume from the history
         if (historyPlace < pathHistory.length - 1) {
              dispatch(setCurrentVolume(pathHistory[historyPlace + 1]));
         }
    };

    const canGoForward = (): boolean => historyPlace < pathHistory.length - 1;
    const canGoBack = (): boolean => historyPlace > 0;

    const navigate = (path: string) => {
        dispatch(navigateTo(path));
        dispatch(setCurrentVolume(path));
    };

    const goHome = () => {
        dispatch(setHistoryPlace(0));
        dispatch(setCurrentVolume(""));
    };

    return {
        pathHistory,
        historyPlace,
        currentVolume,
        onBackArrowClick,
        onForwardArrowClick,
        canGoForward,
        canGoBack,
        navigate,
        goHome
    }
}