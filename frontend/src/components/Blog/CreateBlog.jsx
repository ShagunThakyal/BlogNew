import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
    const initialValues = { title: "", content: "", category: "", image: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);

        if (Object.keys(formErrors).length === 0) {
            console.log(formValues);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    console.log("No access token found");
                    return;
                }

                const formData = new FormData();
                formData.append('title', formValues.title);
                formData.append('content', formValues.content);
                formData.append('category', formValues.category);
                formData.append('image', document.querySelector('input[name="image"]').files[0]);

                const response = await fetch(`http://localhost:3000/api/v1/blog`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log('Error from API:', errorData.message);
                    setFormErrors({ apiError: errorData.message });
                    return;
                }

                const data = await response.json();
                navigate('/');
            } catch (error) {
                console.log("Error while creating blog", error);
                setFormErrors({ apiError: "An error occurred during blog creation" });
            }
        }
    };

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors]);

    const validate = (values) => {
        const errors = {};
        if (!values.content) {
            errors.content = "Content cannot be empty";
        }

        if (!values.title) {
            errors.title = "Title is required";
        } else if (values.title.length < 4) {
            errors.title = "Title must be at least 3 characters long";
        } else if (values.title.length > 200) {
            errors.title = "Title must be less than 200 characters";
        }

        return errors;
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-gray-50 p-6">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-green-600 p-4 text-white text-xl font-semibold">
                    <h2 className="text-center">Create a New Blog Post</h2>
                </div>
                <form className="p-6" onSubmit={handleSubmit}>

                    {/* -------Title---------- */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title:
                        </label>
                        <input
                            className={`w-full px-4 py-2 border rounded-md ${formErrors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formValues.title}
                            onChange={handleChange}
                        />
                        {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    </div>

                    {/* -------Category---------- */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                            Category:
                        </label>
                        <input
                            className={`w-full px-4 py-2 border rounded-md ${formErrors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formValues.category}
                            onChange={handleChange}
                        />
                        {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                    </div>

                    {/* -------Content---------- */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                            Content:
                        </label>
                        <textarea
                            className={`w-full px-4 py-2 border rounded-md ${formErrors.content ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                            name="content"
                            placeholder="Content"
                            value={formValues.content}
                            onChange={handleChange}
                        ></textarea>
                        {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                    </div>

                    {/* -------Image---------- */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image File:
                        </label>
                        <input
                            className="w-full px-4 py-2 border rounded-md file:bg-green-100 file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:text-gray-600 hover:file:bg-green-200"
                            name="image"
                            id="formFileSm"
                            type="file"
                        />
                    </div>

                    {/* -------Button---------- */}
                    <div className="flex justify-center mb-6">
                        <button
                            className="bg-green-600 hover:bg-green-700 focus:outline-none text-white font-bold py-2 px-4 rounded-md shadow-md"
                            type="submit"
                        >
                            Publish
                        </button>
                    </div>

                    {/* -------API Error Message---------- */}
                    {formErrors.apiError && <p className="text-red-500 text-sm text-center mt-4">{formErrors.apiError}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;
