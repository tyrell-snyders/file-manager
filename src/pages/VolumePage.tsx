import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { get_metadata, list_files } from "../IPC/IPCRequests";
import { setVolume, setMetadata } from "../state/volumeSlice";
import { FileMetadata } from "../types";


export default function VolumePage({ volumePath }: { volumePath: string }) {
    const { onBackArrowClick } = useNavigation();
    const dispatch = useDispatch();
    const volume = useSelector((state: RootState) => state.volume.volume);
    const metadata = useSelector((state: RootState) => state.volume.metadata);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolume = async() => {
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
        fetchVolume();
    }, [dispatch, volumePath])

    useEffect(() => {
        console.log(metadata);
    }, [metadata]) // Testing to see if ti fetches metdata properly

    return (
        <div className="">
            <h1>Volume: {volumePath}</h1>
            <button onClick={onBackArrowClick}>Back</button>
            <div className="vh-100 grid md:grid-cols-2 lg:grid-cols-3">
                {error && <ErrorPlaceholder error={error} />}
                {loading && <LoadingPlaceholder />} 
                {!loading && !error && volume?.map((v, i) => (
                    <button key={i} className="m-2 border-2 border-gray-400 p-10 rounded-md">
                        {v.path}
                    </button>
                ))}
            </div>
        </div>
    )
}