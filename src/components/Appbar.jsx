import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

const Appbar = () => {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Handle responsive design
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            
            // Automatically close drawer on desktop
            if (!mobile) {
                setOpen(false);
            }
        };

        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Initial check
        handleResize();

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const links = [
        {
            text: "Create Election",
            link: "/election",
            icon: "📋" // Optional: you can replace with actual icons if desired
        },
        {
            text: "Make your Vote",
            link: "/voting",
            icon: "🗳️"
        },
        {
            text: "Result",
            link: "/result",
            icon: "📊"
        }
    ];

    return (
        <div className="relative">
            {/* AppBar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Drawer Button for Mobile */}
                    {isMobile && (
                        <button
                            className="focus:outline-none"
                            onClick={() => setOpen(!open)}
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    )}

                    {/* Logo */}
                    <NavLink to="/" className="text-2xl font-bold mx-auto lg:mx-0">
                        Voting System
                    </NavLink>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <div className="hidden lg:flex space-x-4">
                            {links.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.link}
                                    className="text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Drawer */}
            {isMobile && (
                <>
                    <div
                        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform ${
                            open ? "translate-x-0" : "-translate-x-full"
                        } z-50`}
                    >
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                            {/* Close Button */}
                            <button
                                className="focus:outline-none text-white"
                                onClick={() => setOpen(false)}
                            >
                                <CloseIcon className="h-6 w-6" />
                            </button>

                            {/* Logo */}
                            <NavLink to="/" className="text-2xl font-bold text-white">
                                Voting App
                            </NavLink>
                        </div>
                        <div className="px-6 py-4 space-y-2">
                            {links.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.link}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-all group"
                                >
                                    <span className="text-2xl">{link.icon}</span>
                                    <span className="text-lg font-medium text-gray-700 group-hover:text-blue-600">
                                        {link.text}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Overlay */}
                    {open && (
                        <div
                            className="fixed inset-0 bg-black opacity-50 z-40"
                            onClick={() => setOpen(false)}
                        ></div>
                    )}
                </>
            )}
        </div>
    );
};

export default Appbar;