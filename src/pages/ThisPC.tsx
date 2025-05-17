import { useEffect } from "react";
import { Volume } from "./../types";
import VolumeList from "../components/main/volumes/VoluemList";
import useNavigation from "../hooks/useNavigation";
import { get_volumes } from "../IPC/IPCRequests"
import { RootState } from "../state/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setVolumes, setCurrentVolume } from "../state/volumeSlice";

export default function ThisPC() {
    const { navigate } = useNavigation();
	const volumes: Volume[] = useSelector((state: RootState) => state.volume.volumes)
	const dispatch = useDispatch();

    useEffect(() => {
        const fetchVolumes = async () => {
            try {
                const loadVolumes = await get_volumes();
                dispatch(setVolumes(loadVolumes));
            } catch (err) {
                console.error("Error fetching volumes:", err);
            }
        };
        fetchVolumes();
    }, [dispatch]);

    async function onVolumeClick(mountpoint: string) {
        dispatch(setCurrentVolume(mountpoint));
        navigate(mountpoint)
    }

	return (
		<>{/* aad */}
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