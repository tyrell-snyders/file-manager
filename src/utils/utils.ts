import {Mtd, SystemTime} from "../types";
import {useDispatch} from "react-redux";
import {setCurrentVolume, setMetadata, setVolume, setVolumes} from "../state/volumeSlice";

class Utils {
    static formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    static fromString = (json: string): Mtd => {
        return JSON.parse(json) as Mtd;
    }

    static toJson = (obj: object): string => {
        return JSON.stringify(obj);
    }

    static formatDate = (time: SystemTime): string => {
        const millis = time.secs_since_epoch * 1000 + Math.floor(time.nanos_since_epoch / 1_000_000);
        const dateObj = new Date(millis);

        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ` +
            `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    };

    static resetDefault = () => {
        const dispatch = useDispatch();
        dispatch(setVolumes([]));
        dispatch(setMetadata({} as Mtd));
        dispatch(setVolume([]));
        dispatch(setCurrentVolume(""));
    }
}

export default Utils;