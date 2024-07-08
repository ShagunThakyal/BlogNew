import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const initialValues = { username: "", email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);

        if (Object.keys(formErrors).length === 0) {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/user/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formValues),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log('Login failed:', errorData.message);
                    setFormErrors({ apiError: errorData.message });
                    return;
                }

                const data = await response.json();
                console.log('Response data:', data); // Log the entire response data

                const accessToken = data.data.accessToken;
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    console.log('Login successful and token stored');
                    navigate('/'); // Redirect to home page upon successful login
                } else {
                    console.log('Login failed: No access token received');
                }
            } catch (error) {
                console.log("Error while logging in", error);
                setFormErrors({ apiError: "An error occurred during login" });
            }
        }
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors, isSubmit, formValues]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.username) {
            errors.username = "Username is required";
        }
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
            errors.email = "Email is not valid";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be at least 4 characters long";
        } else if (values.password.length > 10) {
            errors.password = "Password must be less than 10 characters";
        }

        return errors;
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-full shadow-md">
                        <FaSignInAlt className="text-green-600 text-3xl" />
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">Login to Your Account</p>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Log In</h2>
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formValues.username}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formValues.password}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                    </div>

                    {/* Login Button */}
                    <div className="mb-6">
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="submit"
                        >
                            Log In
                        </button>
                    </div>

                    {/* Sign-Up */}
                    <div className="text-center text-gray-600">
                        <p className="text-sm mb-4">Don't have an account? <Link to="/register" className="text-green-500 hover:text-green-600">Register here</Link></p>
                    </div>
                    {formErrors.apiError && <p className="text-red-500 text-sm text-center">{formErrors.apiError}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
