import { Volume } from "../../../types";
import React, { MouseEventHandler } from "react";

interface Props {
    volume: Volume;
    onClick: MouseEventHandler<HTMLButtonElement>
}

const compare = (prev: Volume, next: Volume) => {
    return (
        prev.name === next.name &&
        prev.mountpoint === next.mountpoint &&
        prev.available_gb === next.available_gb &&
        prev.total_gb === next.total_gb &&
        prev.used_gb === next.used_gb
    );
}


const VolumeComponent = React.memo(({ volume, onClick }: Props) => {
  const progress = Math.round((volume.used_gb / Math.max(volume.total_gb, 1)) * 100);
  
  return (
    <button onClick={onClick} className="p-5 m-10 w-56 bg-darker radius rounded cursor-pointer">
      <h3>{volume.name} ({volume.mountpoint})</h3>
      <progress max="100" value={progress} />
      <br />
      {volume.available_gb.toFixed(1)} GB free of {volume.total_gb.toFixed(1)} GB
    </button>
  );
}, (prev: Props, next: Props) => compare(prev.volume, next.volume));

export default VolumeComponent;