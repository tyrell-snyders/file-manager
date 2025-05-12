import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { listen } from "@tauri-apps/api/event";
import { list_files, get_mtd } from "../IPC/IPCRequests";
import { setVolume, setMetadata } from "../state/volumeSlice";
import { Mtd } from "../types";
// import { event } from "@tauri-apps/api";
import Drawer from "../components/Drawer";
import Utils from "../utils/utils";


export default function VolumePage() {
    const { onBackArrowClick } = useNavigation();
    const dispatch = useDispatch();
    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume);
    const metadata = useSelector((state: RootState) => state.volume.metadata);
    const [mData, setMData] = useState("")
    const volume = useSelector((state: RootState) => state.volume.volume);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const fetchVolume = async(volumePath: string) => {
        setError("");
        setLoading(true);
        try {
            const vol = await list_files(volumePath);
            dispatch(setVolume(vol))
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
            dispatch(setMetadata({} as Mtd));
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

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const handleMtd = (mtd: string) => {
        return Utils.fromString(mtd);
    }

    useEffect(() => {
        if (mData) {
            dispatch(setMetadata(handleMtd(mData)));
            console.log("Metadata: ", metadata.created_at);
        }
    }, [mData])

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow">
                <h1>Volume: {currentVolume}</h1>
                <button onClick={onBackArrowClick}>Back</button>
                <div className="vh-100 grid md:grid-cols-2 lg:grid-cols-3">
                    {error && <ErrorPlaceholder error={error} />}
                    {loading && <LoadingPlaceholder />}
                    {!loading && !error && volume?.map((v, i) => (
                        <button
                            key={i}
                            className="m-2 border-2 border-gray-400 p-10 rounded-md"
                            onClick={() => {
                                openDrawer();
                                get_mtd(currentVolume, v.path.slice(3)).then(data => {
                                    setMData(data);
                                });
                            }}
                        >
                            {v.path.slice(3)} <br />
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0">
                <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    {metadata  && (
                        <div>
                            <h2>{metadata.name}</h2>
                            <h4>Path: {metadata.path}</h4>
                            <h5>Size: {Utils.formatBytes(metadata.size)}</h5>
                            {/* <h5>Created at: {Utils.formatDate(metadata.created_at)}</h5> */}
                        </div>
                    )}
                </Drawer>
            </div>
        </div>
    );
}

