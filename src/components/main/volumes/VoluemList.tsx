import VolumeComponent from "./VolumeComponent";
import { Volume } from "../../../types";
import LoadingPlaceholder from "../../LoadingPlaceholder";

interface Props {
    volumes: Volume[];
    onClick: (mountpoint: string) => any;
}

export default function VolumeList({ volumes, onClick }: Props) {
    return (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-1 m-6">
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