import React, { ReactNode } from "react";

interface ModalWrapperProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    width?: string;
    height?: string;
    children: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
    isOpen,
    setIsOpen,
    width = "max-w-lg",
    height = "max-h-[80vh]",
    children,

}) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`w-full h-screen fixed top-0 left-0 z-[98] ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    } bg-black/50 backdrop-blur-sm transition-opacity duration-300`}
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div
                className={`fixed z-[99] top-1/2 left-1/2 -translate-1/2  px-3 py-5  ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    } bg-secondary rounded-xl shadow-modal transform transition-all duration-300 ease-out scale-100 ${width} ${height}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
};

export default ModalWrapper;