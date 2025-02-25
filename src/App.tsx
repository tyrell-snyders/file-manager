import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Button, { ButtonSize } from "./components/Button";
import { Volume } from "./types";

function App() {
	const [drives, setDrives] = useState<string[]>([])
	const [volumes, setVolumes] = useState<Volume[]>([])
	// get the drives
	async function get_drives() {
		try {
			const result = await invoke<string[]>('get_drives')
			setDrives(result)
		} catch (e)  {
			console.error("Error fetching drives:", e)
		}
	}

	// get volumes
	async function getVolumes() {
		try {
        	const newVolumes = await invoke<Volume[]>('get_volumes');
        	setVolumes(newVolumes);
		} catch (error) {
			console.error("Error fetching volumes:", error);
		}
	}

	let render = 0;
		useEffect(() => {
			if (render === 0) {
		getVolumes().catch(console.error);
		}
		render += 1;
	}, [])

	return (
		<>
			<div>
				{/* <Button size={ButtonSize.Small} onClick={getVolumes} children={"Get Volumes"} /> */}
				<div className="p-4 m-4">
					<h1>This PC</h1>
					<div className="items-center justify-center">
						{volumes.map((v, i) => (
							<div className="items-center m-6 border rounded-md p-4 shadow-lg" key={i}>
								<h3 className="text-">{v.name} ({v.mountpoint})</h3>
								<p>Size: {v.total_gb}GB</p>
								<p>Used: {v.used_gb}GB</p>
								<p>Available: {v.available_gb}GB</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default App;