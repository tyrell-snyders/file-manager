import { useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import { invoke } from "@tauri-apps/api/core";
import LoadingPlaceholder from "../components/LoadingPlaceholder";

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
        <div>
            <h1>Volume: {volumePath}</h1>
            <button onClick={onBackArrowClick}>Back</button>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {content?.length === 0 ? <LoadingPlaceholder /> : content?.map((c, i) => (
                <div key={i}>
                    {c.path}
                </div>
            ))}
        </div>
    )
}