import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { listen } from "@tauri-apps/api/event";
import { get_metadata, list_files } from "../IPC/IPCRequests";
import { setVolume, setMetadata } from "../state/volumeSlice";
import { FileMetadata, FileInfo } from "../types";
// import { event } from "@tauri-apps/api";
import Drawer from "../components/Drawer";

interface FileMeta {
    [filename: string]: string
}


export default function VolumePage() {
    const { onBackArrowClick } = useNavigation();
    const dispatch = useDispatch();
    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume);
    const metadata = useSelector((state: RootState) => state.volume.metadata);
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
            const metadata: FileMetadata = await get_metadata(volumePath);
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

    useEffect(() => {
        console.log(metadata);
    }, [metadata]);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => {
        setIsDrawerOpen(false);
        dispatch(setMetadata({}));
    }

    const handleFiles = (files: FileMeta) => {
        return Object.keys(files).map((key) => {
            return {
                name: key,
                size: files[key]
            }
        });
    }

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
                            onClick={openDrawer}
                        >
                            {v.path}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0">
                <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    {metadata && Object.keys(metadata).length > 0 ? (
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-2">Metadata</h2>
                            <ul className="list-disc pl-6">
                                {Object.entries(metadata).map(([vol]) => {
                                    const fileMeta: FileMeta = metadata[vol];
                                    const fileList = handleFiles(fileMeta); 
                                    if (vol === currentVolume) {
                                        return fileList.map((file, index) => (
                                            <li key={index} className="mb-2">
                                                <span className="font-semibold">{file.name}</span>
                                            </li>
                                        ));
                                    };
                                })} 
                            </ul>
                        </div>
                    ): (
                        <div className="flex flex-col items-center justify-center h-full">
                            <h2 className="text-lg font-semibold">No metadata available</h2>
                            <p className="text-gray-500">Please select a volume to view its metadata.</p>
                        </div>
                    )}  
                </Drawer>
            </div>
        </div>
    );
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}