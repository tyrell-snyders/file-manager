import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { navigateTo, goBack, goForward } from "../state/navigationSlice";

export default function useNavigation() {
    const dispatch = useDispatch()
    const { pathHistory, historyPlace, currentVolume } = useSelector((state: RootState) => state.navigation);

    const onBackArrowClick = () => {
        console.log({
            currentVolume,
            pathHistory,
            historyPlace,
        })
        dispatch(goBack());
    };

    const onForwardArrowClick = () => {
        dispatch(goForward());
    };

    const canGoForward = (): boolean => historyPlace < pathHistory.length - 1;
    const canGoBack = (): boolean => historyPlace > 0;

    const navigate = (path: string) => {
        dispatch(navigateTo(path));
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
    }
}