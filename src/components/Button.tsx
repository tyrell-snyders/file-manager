import { MouseEventHandler, ReactNode } from "react";

export enum ButtonSize {
    Small,
    Medium
}

interface Props {
    children: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    size: ButtonSize;
    className?: string;
}

export function Button({ children, onClick, size, className }: Props) {
    let styles = `bg-bright hover:bg-gray-600 rounded-lg shadow-xl ${className + " " || ""}`;
    switch (size) {
        case ButtonSize.Small:
            styles += "h-6 w-24";
            break;
        default: break;
    }

    return (
        <button className={styles} onClick={onClick}>{children}</button>
    )
}