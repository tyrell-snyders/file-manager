import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { DirectoryContent, Volume } from "./../types";
import VolumeList from "../components/main/volumes/VoluemList";
import useNavigation from "../hooks/useNavigation";


export default function ThisPC() {
    const [volumes, setVolumes] = useState<Volume[]>([])
    const [searchResults, setSearchResults] = useState<DirectoryContent[]>([])

    const { navigate } = useNavigation();

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

    async function onVolumeClick(mountpoint: string) {
        navigate(mountpoint)
    }

	return (
		<>
			<div>
				<div className="p-4 m-4">
					<h1 className="font-bold">This PC</h1>
					<div className="grid items-center justify-center">
						<VolumeList volumes={volumes} onClick={onVolumeClick} />
					</div>
				</div>
			</div>
		</>
	)
}