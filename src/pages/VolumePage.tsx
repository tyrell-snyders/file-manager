import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { listen } from "@tauri-apps/api/event";
import { get_metadata, list_files } from "../IPC/IPCRequests";
import { setVolume, setMetadata } from "../state/volumeSlice";
import { FileMetadata } from "../types";
// import { event } from "@tauri-apps/api";


export default function VolumePage() {
    const { onBackArrowClick } = useNavigation();
    const dispatch = useDispatch();
    const volume = useSelector((state: RootState) => state.volume.volume);
    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume);
    const metadata = useSelector((state: RootState) => state.volume.metadata);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);

    const fetchVolume = async(volumePath: string) => {
        setError("");
        setLoading(true);
        try {
            const vol = await list_files(currentVolume);
            dispatch(setVolume(vol))

            const metadata: FileMetadata = await get_metadata(currentVolume);
            dispatch(setMetadata(metadata))
        } catch (err) {
            console.log(err);
            if (err instanceof Error)
                setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (currentVolume) {
            fetchVolume(currentVolume);
        } else {
            setLoading(false);
            setError("No volume selected.");
            dispatch(setVolume([]));
            dispatch(setMetadata({}));
        }
    }, [currentVolume, dispatch]);

    useEffect(() => {
        let isSubscribed = true;
        let unlistenFn: Promise<() => void> | null = null;

        if (currentVolume) {
             unlistenFn = listen('cache-updated', (event) => {
                console.log('Cache update event received:', event); 
                if (isSubscribed && typeof event.payload === 'string' && event.payload === currentVolume) {
                    console.log(`Cache updated for ${currentVolume}, refetching...`);
                    fetchVolume(currentVolume); // Refetch data
                }
            });
        }

        return () => {
            isSubscribed = false;
            if (unlistenFn) {
                unlistenFn.then(f => f());
            }
        }
    }, [currentVolume]);


    return (
        <div className="">
            <h1>Volume: {currentVolume}</h1>
            <button onClick={onBackArrowClick}>Back</button>
            <div className="vh-100 grid md:grid-cols-2 lg:grid-cols-3">
                {error && <ErrorPlaceholder error={error} />}
                {loading && <LoadingPlaceholder />}
                {!loading && !error && volume?.map((v, i) => (
                    <button
                        key={i}
                        className="m-2 border-2 border-gray-400 p-10 rounded-md"
                    >
                        {v.path}
                    </button>
                ))}
            </div>
        </div>
    );
}