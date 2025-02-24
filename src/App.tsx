import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
	const [drives, setDrives] = useState<string[]>([])
	// get the drives
	async function get_drives() {
		try {
			const result = await invoke<string[]>('get_drives')
			setDrives(result)
		} catch (e)  {
			console.error("Error fetching drives:", e)
		}
	}

	return (
		<div>
			<button onClick={get_drives}>Get Drives</button>
			<ul>
				{drives.map((drive, i) => (
					<li key={i}>{drive}</li>
				))}
			</ul>
		</div>
	)
}

export default App;