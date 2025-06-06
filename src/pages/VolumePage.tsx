import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { listen } from "@tauri-apps/api/event";
import { list_files, get_mtd } from "../IPC/IPCRequests";
import { setVolume, setMetadata } from "../state/volumeSlice";
import { Mtd, SystemTime } from "../types";
// import { event } from "@tauri-apps/api";
import {Drawer} from "../components/Drawer";
import Utils from "../utils/utils";
import {FileComponent} from "../components/FileComponent.tsx";
import AddButton from "../components/main/Add/AddButton.tsx";



export default function VolumePage() {
    const { onBackArrowClick } = useNavigation();
    const dispatch = useDispatch();

    const currentVolume = useSelector((state: RootState) => state.volume.currentVolume);
    const metadata = useSelector((state: RootState) => state.volume.metadata);
    const volume = useSelector((state: RootState) => state.volume.volume);

    const [mData, setMData] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [dateTime, setDateTime] = useState<SystemTime>({} as SystemTime);

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
        }
    }, [mData])

    useEffect(() => {
        if (metadata) {
            setDateTime(metadata.created_at);
        }
    }, [metadata])

    const handleOpnDrawer = (fileName: string) => {
        openDrawer();
        get_mtd(currentVolume, fileName.slice(3)).then(data => {
            setMData(data);
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
                        <FileComponent
                            fileName={v.path.slice(3)}
                            onClick={() => handleOpnDrawer(v.path)}
                            key={i}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-row static m-6">
                <AddButton />
            </div>

            <div className="flex-shrink-0">
                <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    {metadata  && (
                        <div className="flex flex-col justify-around">
                            <h1 className="font-black pb-5">{metadata.name}</h1>
                            <h3 className="text-l font-bold">Path: {metadata.path}</h3>
                            <h5 className="text-l font-bold">Size: {Utils.formatBytes(metadata.size)}</h5>
                            {dateTime && (
                                <h5 className="text-l font-bold">Created at: {Utils.formatDate(dateTime)}</h5>
                            )}
                            <h5 className="text-l font-bold">Type: {metadata.is_dir ? "Directory" : "File"}</h5>
                        </div>
                    )}
                </Drawer>
            </div>
        </div>
    );
}

