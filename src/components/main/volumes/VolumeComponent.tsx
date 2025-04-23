import { Volume } from "../../../types";
import { MouseEventHandler } from "react";

interface Props {
    volume: Volume;
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default function VolumeComponent({ volume, onClick }: Props) {
    const progress = Math.round((volume.used_gb / Math.max(volume.total_gb, 1)) * 100);
    return (
        <button onClick={onClick} className="p-5 m-10 w-56 bg-darker radius rounded cursor-pointer">
            <h3>{volume.name} ({volume.mountpoint})</h3>
            <progress max="100" value={Number.isNaN(progress) ? 0 : progress} /> <br />
            {volume.available_gb.toFixed(1)} GB free of {volume.total_gb.toFixed(1)} GB
        </button>
    )
}