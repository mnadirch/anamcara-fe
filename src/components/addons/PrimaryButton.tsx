import React from "react";
import { IconType } from "react-icons/lib";

interface ButtonProps {
    text: string;
    icon?: HTMLAllCollection | IconType | any;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    iconPosition?: "prefix" | "postfix";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
    center?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
    text,
    icon,
    onClick,
    iconPosition = "prefix",
    type = "button",
    disabled = false,
    className = "",
    isLoading = false,
    center = true
}) => {
    return (
        <div className={`${center ? 'w-full' : 'w-fit'} flex justify-center`}>
            <button
                type={type}
                onClick={onClick ? onClick : () => { }}
                disabled={disabled || isLoading}
                className={`bg-white ${iconPosition === "prefix" ? "flex-row" : "flex-row-reverse"
                    } transition-all duration-500 cursor-pointer lg:text-base md:text-sm text-xs text-secondary font-medium hover:bg-gray-200 flex items-center justify-center gap-3 ${className
                    } ${isLoading ? "opacity-50 cursor-not-allowed !w-fit aspect-square p-2 rounded-full" : "lg:py-3 py-2 2xl:px-12 lg:px-10 px-8 rounded-lg"}`}
            >
                {isLoading ? (
                    <span className="w-6 h-6 rounded-full border-t-2 border-l-2 border-primary animate-spin"></span>
                ) : (
                    <>
                        {icon ? icon : null}
                        {text}
                    </>
                )}
            </button>
        </div>
    );
};

export default PrimaryButton;