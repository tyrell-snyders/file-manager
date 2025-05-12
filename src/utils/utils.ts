import { Mtd, SystemTime } from "../types";

class Utils {
    static formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    static fromString = (json: string): Mtd => {
        const jsonObj = JSON.parse(json) as Mtd;
        return jsonObj;
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
}

export default Utils;