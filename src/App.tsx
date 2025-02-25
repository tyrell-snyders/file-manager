import "./App.css";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import ThisPC from "./pages/ThisPC";

function App() {

	return (
		<Router>
			<nav>
				<Link to="/">This PC</Link>
			</nav>
			<Routes>
				<Route path="/" element={<ThisPC />} />
			</Routes>
		</Router>
	)
}

export default App;