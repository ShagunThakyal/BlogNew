// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';  // Import the add blog icon from React Icons
import logo from '../../assets/horizontal-logo.png';  // Import the logo from assets

export default function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();  // Initialize the useNavigate hook

    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setUser(null);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/v1/user/current-user', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.data) {
                    setUser(result.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3000/api/v1/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Include cookies with the request
            });

            // Clear tokens from local storage and redirect to the home page
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');  // Redirect to home page after logout

        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="shadow-md sticky z-50 top-0 bg-white border-b border-gray-200">
            <nav className="container mx-auto flex justify-between items-center px-4 py-2 lg:px-4 lg:py-2">
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}  // Use the imported logo
                        className="mr-2 h-10 md:h-12 lg:h-14"  // Adjusted sizes for the logo
                        alt="ZenVibe Logo"
                    />
                </Link>
                <div className="flex items-center lg:order-2">
                    {user ? (
                        <>
                            <Link to="/profile" className="mr-3 flex items-center">
                                <img
                                    src={user.avatar || 'https://via.placeholder.com/40'}  // Fallback avatar
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover hover:shadow-md transition-shadow duration-300"
                                />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-1.5 mr-2 focus:outline-none transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-green-600 hover:bg-gray-100 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-1.5 mr-2 focus:outline-none transition-colors duration-300"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-1.5 mr-2 focus:outline-none transition-colors duration-300"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex lg:hidden items-center">
                    <NavLink
                        to="/createBlog"
                        className="text-green-600 hover:bg-gray-100 focus:ring-4 focus:ring-green-300 rounded-full p-2 flex items-center"
                    >
                        <AiOutlinePlus className="text-2xl" /> {/* Add Blog icon */}
                    </NavLink>
                </div>
                <div className="hidden lg:flex lg:justify-between items-center w-full lg:w-auto lg:order-1">
                    <ul className="flex space-x-4 font-medium">
                        <li>
                            <NavLink to="/" className={({ isActive }) =>
                                `text-sm lg:text-lg px-2 py-1 rounded-full transition-colors duration-300
                                 ${isActive ? "text-white bg-green-600 shadow-md" : "text-gray-700 hover:bg-gray-100"}
                                 flex items-center`
                            }>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className={({ isActive }) =>
                                `text-sm lg:text-lg px-2 py-1 rounded-full transition-colors duration-300
                                 ${isActive ? "text-white bg-green-600 shadow-md" : "text-gray-700 hover:bg-gray-100"}
                                 flex items-center`
                            }>
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" className={({ isActive }) =>
                                `text-sm lg:text-lg px-2 py-1 rounded-full transition-colors duration-300
                                 ${isActive ? "text-white bg-green-600 shadow-md" : "text-gray-700 hover:bg-gray-100"}
                                 flex items-center`
                            }>
                                Contact Us
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/createBlog"
                                className={({ isActive }) =>
                                    `text-sm lg:text-lg px-2 py-1 rounded-full transition-colors duration-300
                                     ${isActive ? "text-white bg-green-600 shadow-md" : "text-gray-700 hover:bg-gray-100"}
                                     flex items-center`
                                }
                            >
                                <AiOutlinePlus className="text-xl lg:text-2xl" /> {/* Add Blog icon */}
                                <span className="hidden lg:inline-block ml-2">Add Blog</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
