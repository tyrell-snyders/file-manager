import "./App.css";
import ThisPC from "./pages/ThisPC";
import { useSelector } from "react-redux";
import { RootState } from "./state/store/store";
import VolumePage from "./pages/VolumePage";
import SearchBar from "./components/topbar/SearchBar";
import useNavigation from "./hooks/useNavigation";
import { useEffect } from "react";


function App() {
     const { goHome } = useNavigation();
    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume); // Corrected line
    const currentDirectoryPath = useSelector((state: RootState) => state.volume.currentDirectoryPath);
    const historyPlace = useSelector((state: RootState) => state.navigation.historyPlace);


    useEffect(() => {
        if(historyPlace !== 0 && !currentVolume) {
            goHome();
        }
    }, [historyPlace, currentVolume, goHome])


	if (historyPlace === 0) {
		return <ThisPC />;
	}
    return (
        <div>
            <SearchBar
                currentDirectoryPath={currentDirectoryPath}
                currentVolume={currentVolume}
            />
            <VolumePage />
        </div>
    );
}

export default App;