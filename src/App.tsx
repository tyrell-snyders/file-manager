import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
	const [counter, setCounter] = useState(0)
	return (
		<>
			<div>
				<p>Counter: {counter}</p>
				<button onClick={() => setCounter(counter + 1)}>Increase</button>
			</div>
		</>
	)
}

export default App;
