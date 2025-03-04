import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store/store";
import { list_files } from "../IPC/IPCRequests";
import { setVolume } from "../state/volumeSlice";


export default function VolumePage({ volumePath }: { volumePath: string }) {
    const { onBackArrowClick } = useNavigation();
    const dispatch = useDispatch();
    const volume = useSelector((state: RootState) => state.volume.volume);
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchVolume = async() => {
            try {
                const vol = await list_files(volumePath);
                dispatch(setVolume(vol))
            } catch (err) {
                console.log(err);
                setError("Error fetching volume");
            }
        }
        fetchVolume();
    }, [dispatch, volumePath])

    return (
        <div className="">
            <h1>Volume: {volumePath}</h1>
            <button onClick={onBackArrowClick}>Back</button>
            <div className="vh-100 grid md:grid-cols-2 lg:grid-cols-3">
                {error && <ErrorPlaceholder error={error} />}
                {volume?.length === 0 ? <LoadingPlaceholder /> : volume?.map((v, i) => (
                    <button key={i} className="m-2 border-2 border-gray-400 p-10 rounded-md">
                        {v.path}
                    </button>
                ))}
            </div>
        </div>
    )
}