import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import { invoke } from "@tauri-apps/api/core";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";

interface Content {
    path: string;
}

export default function VolumePage({ volumePath }: { volumePath: string }) {
    const { onBackArrowClick } = useNavigation();
    const [content, setContent] = useState<Content[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function getContent() {
        try {
            const cnt: string[] = await invoke("list_files", { path: volumePath });
            setContent(cnt.map((path) => ({ path })))
            setError(null)
        } catch (err) {
            setError(err as string);
            setContent(null);
        }
    }

    useEffect(() => {
        getContent();
    }, [volumePath])

    return (
        <div className="">
            <h1>Volume: {volumePath}</h1>
            <button onClick={onBackArrowClick}>Back</button>
            <div className="vh-100 grid md:grid-cols-2 lg:grid-cols-3">
                {error && <ErrorPlaceholder error={error} />}
                {content?.length === 0 ? <LoadingPlaceholder /> : content?.map((c, i) => (
                    <button key={i} className="m-2 border-2 border-gray-400 p-10 rounded-md">
                        {c.path}
                    </button>
                ))}
            </div>
        </div>
    )
}