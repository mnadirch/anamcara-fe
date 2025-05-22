// components/ui/Dropdown.tsx
import { useState } from 'react';

interface DropdownItem {
    label: string;
    onClick: () => void;
    className?: string;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
}

export const Dropdown = ({ trigger, items }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-40 bg-[#272727] rounded-md shadow-lg z-10 border border-gray-700"
                    onClick={() => setIsOpen(false)}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                item.onClick();
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#333333] ${item.className || 'text-white'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};