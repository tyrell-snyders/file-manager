import VolumeComponent from "./VolumeComponent";
import { Volume } from "../../../types";
import LoadingPlaceholder from "../../LoadingPlaceholder";

interface Props {
    volumes: Volume[];
    onClick: (mountpoint: string) => any;
}

export default function VolumeList({ volumes, onClick }: Props) {
    return (
        <div className="space-x-4">
            {volumes.length == 0 ? <LoadingPlaceholder /> : volumes.map((v, i) => (
                <VolumeComponent 
                    onClick={() => onClick(v.mountpoint)}
                    volume={v}
                    key={i}
                />
            ))}
        </div>
    )
}