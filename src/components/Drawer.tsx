import { useEffect, useState } from "react";

export function Drawer(
    props: {
        children: React.ReactNode;
        isOpen: boolean;
        onClose: () => void;
    }
) {
    const [isOpen, setIsOpen] = useState(props.isOpen);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen]);

    const handleClose = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsTransitioning(false);
            props.onClose();
        }, 300);
    };

    return (
        <div className={`fixed inset-0 z-50 transition-transform duration-300 
            ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
            <div className="bg-transparent bg-opacity-75 absolute inset-0" onClick={handleClose}></div>
            <div className="bg-white w-64 h-full shadow-lg p-4 relative z-10 text-gray-500 overflow-y-auto">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    &times;
                </button>
                {props.children}
            </div>
        </div>
    );
}