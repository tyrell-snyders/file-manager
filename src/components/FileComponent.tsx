import { MouseEventHandler } from "react";

interface Props {
    fileName: String;
    onClick: MouseEventHandler<HTMLButtonElement>;
    key: number;
}
const styles = "m-2 border-2 border-gray-400 p-10 rounded-md";

export function FileComponent({ fileName, onClick }: Props) {
    return (
        <button className={styles} onClick={onClick}>
            {fileName}
        </button>
    );
}