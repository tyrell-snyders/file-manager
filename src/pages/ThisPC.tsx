import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Volume } from "./../types";
import { useNavigate } from "react-router-dom";
import VolumeList from "../components/main/volumes/VoluemList";

export default function ThisPC() {
    const [volumes, setVolumes] = useState<Volume[]>([])
    const nav = useNavigate();

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
					<h1 className="font-bold">This PC</h1>
					<div className="grid grid-cols-3 items-center justify-center">
						{/* <VolumeList volumes={volumes} onClick={} /> */}
					</div>
				</div>
			</div>
		</>
	)
}