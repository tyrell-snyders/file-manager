import "./App.css";
// import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import ThisPC from "./pages/ThisPC";
import { useSelector } from "react-redux";
import { RootState } from "./state/store/store";
import VolumePage from "./pages/VolumePage";
import SearchBar from "./components/topbar/SearchBar";

function App() {
	const currentVolume = useSelector((state: RootState) => state.navigation.currentVolume);
	const currentDirectoryPath = useSelector((state: RootState) => state.volume.currentDirectoryPath);
	const historyPlace = useSelector((state: RootState) => state.navigation.historyPlace);

	if (historyPlace === 0) {
		return <ThisPC />;
	}

	return (
		<div>
			<SearchBar 
				currentDirectoryPath={currentDirectoryPath} 
				currentVolume={currentVolume} 
			/>
			<VolumePage volumePath={currentVolume} />
		</div>
	);
}

export default App;