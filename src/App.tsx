import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Volume } from "./types";
import { useNavigate } from "react-router";

function App() {
	const [volumes, setVolumes] = useState<Volume[]>([])
	const navigate = useNavigate();
	
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
		if (render === 0) getVolumes();
		render += 1;
	}, [])

	return (
		<>
			<div>
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