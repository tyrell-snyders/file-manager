import "./App.css";
// import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import ThisPC from "./pages/ThisPC";
import { useSelector } from "react-redux";
import { RootState } from "./state/store/store";
import VolumePage from "./pages/VolumePage";

function App() {
	const currentVolume = useSelector((state: RootState) => state.navigation.currentVolume);

	return (
		<div>
            {currentVolume === "" ? <ThisPC /> : <VolumePage volumePath={currentVolume} />}
        </div>
	)
}

export default App;