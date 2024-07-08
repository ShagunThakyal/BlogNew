import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
    const initialValues = { username: "", fullName: "", email: "", password: "", avatar: null };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            setFormValues({ ...formValues, [name]: files[0] });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);

        if (Object.keys(formErrors).length === 0) {
            try {
                const formData = new FormData();
                formData.append("username", formValues.username);
                formData.append("fullName", formValues.fullName);
                formData.append("email", formValues.email);
                formData.append("password", formValues.password);
                if (formValues.avatar) {
                    formData.append("avatar", formValues.avatar);
                }

                const response = await fetch(`http://localhost:3000/api/v1/user/register`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setFormErrors({ apiError: errorData.message });
                    return;
                }

                navigate('/login'); // Redirect to login page after successful registration
            } catch (error) {
                setFormErrors({ apiError: "An error occurred during registration" });
            }
        }
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.username) {
            errors.username = "Username is required";
        }
        if (!values.fullName) {
            errors.fullName = "Fullname is required";
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
                        <FaUserPlus className="text-green-600 text-3xl" />
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">Register to Create an Account</p>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
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

                    {/* Full Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formValues.fullName}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
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

                    {/* Avatar */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="avatar">
                            Avatar
                        </label>
                        <input
                            className="block w-full text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="avatar"
                            id="avatar"
                            type="file"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Register Button */}
                    <div className="mb-6">
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="submit"
                        >
                            Register
                        </button>
                    </div>

                    {/* Sign-Up */}
                    <div className="text-center text-gray-600">
                        <p className="text-sm mb-4">Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600">Login here</Link></p>
                    </div>
                    {formErrors.apiError && <p className="text-red-500 text-sm text-center">{formErrors.apiError}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
