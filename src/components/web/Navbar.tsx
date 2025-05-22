import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo } from "../../../public";
import { dropdownLinks, navlinks } from "../../constants";
import { useAuth } from "../../context/AuthProvider";
import { HiOutlineMenu } from "react-icons/hi";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState<boolean>(false);
    const { accessToken, role } = useAuth();

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
        setIsResourcesOpen(false);
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 shadow-lg text-white flex items-center justify-between px-4 py-3 bg-transparent">
            {/* Logo */}
            <div
                className="flex flex-col sm:flex-row items-center cursor-pointer space-x-2 sm:space-x-1"
                onClick={() => handleNavigate("/home")}
            >
                <img src={logo} alt="Logo" className="w-16 h-auto" />
                <span className="text-xs sm:text-sm md:text-sm font-bold tracking-wide text-white whitespace-nowrap">
                    ANAMCARA AI
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
                {navlinks.map((link, index) => (
                    <div key={index} className="relative">
                        {link.hasDropdown ? (
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                            >
                                <span className="relative group text-white text-sm whitespace-nowrap font-mowaq">
                                    {link.name}
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#ADFF00] transition-all duration-300 group-hover:w-full"></span>
                                </span>
                                <span
                                    className={`ml-2 transform transition-transform duration-300 ${isResourcesOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    ⌃
                                </span>
                            </div>
                        ) : (
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigate(link.path);
                                }}
                                className="relative group text-white text-sm whitespace-nowrap block font-mowaq"
                            >
                                {link.name}
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#ADFF00] transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        )}
                        {/* Dropdown Menu */}
                        {link.hasDropdown && isResourcesOpen && (
                            <div className="absolute top-full left-0 w-48 text-white shadow-lg rounded-lg mt-2 z-50 bg-[#111]/80">
                                {dropdownLinks.map((dropdownLink, idx) => (
                                    <a
                                        key={idx}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigate(dropdownLink.path);
                                            setIsResourcesOpen(false);
                                        }}
                                        className="relative block px-4 py-2 text-white group hover:bg-[#222]/50 text-xs lg:text-sm"
                                    >
                                        {dropdownLink.name}
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#ADFF00] transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Call-to-Action Button (Desktop Only) */}
            <div className="hidden lg:flex">
                {accessToken ? (
                    role === "superadmin" ?
                        (
                            <button onClick={() => navigate('/admin/blogs')} className="px-4 py-2 text-sm font-medium border border-[#ADFF00] transition-all duration-300 bg-[#ADFF00] text-black hover:bg-black hover:text-white">
                                Dashboard
                            </button>
                        ) : null
                ) : (

                    <button onClick={() => navigate('/auth/login')} className="px-4 py-2 text-sm font-medium border border-[#ADFF00] transition-all duration-300 bg-[#ADFF00] text-black hover:bg-black hover:text-white">
                        Get Connected
                    </button>
                )}


            </div>

            {/* Hamburger Menu Icon (Mobile Only) */}
            <HiOutlineMenu className="text-xl lg:hidden cursor-pointer" onClick={() => setIsMenuOpen(true)} />

            {/* Mobile Sidebar (Left Slide-in) */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-[#111]/90 shadow-lg transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-500 ease-in-out z-50 lg:hidden`}
            >
                {/* Close Button */}
                <div className="flex justify-end p-5">
                    <button className="text-white text-2xl" onClick={() => setIsMenuOpen(false)}>
                        ✕
                    </button>
                </div>

                {/* Sidebar Links */}
                <div className="flex flex-col space-y-6 px-6">
                    {navlinks.map((link, index) => (
                        <div key={index} className="relative">
                            {link?.hasDropdown ? (
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                                >
                                    <span className="relative group text-white text-lg">
                                        {link.name}
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#ADFF00] transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                    <span
                                        className={`ml-2 transform transition-transform duration-300 ${isResourcesOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        ⌃
                                    </span>
                                </div>
                            ) : (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigate(link.path);
                                    }}
                                    className="relative group text-white text-lg block"
                                >
                                    {link.name}
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#ADFF00] transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            )}
                            {/* Dropdown Menu */}
                            {link.hasDropdown && isResourcesOpen && (
                                <div className="pl-4 mt-2">
                                    {dropdownLinks.map((dropdownLink, idx) => (
                                        <a
                                            key={idx}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigate(dropdownLink.path);
                                            }}
                                            className="relative block py-1 text-white text-sm group hover:text-[#ADFF00]"
                                        >
                                            {dropdownLink.name}
                                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#ADFF00] transition-all duration-300 group-hover:w-full"></span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
