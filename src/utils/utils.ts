import { Mtd } from "../types";

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
}

export default Utils;