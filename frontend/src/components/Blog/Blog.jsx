import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Comments from '../Comments/Comments';

function Blog() {
    const accessToken = localStorage.getItem('accessToken');
    const [blogs, setBlogs] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!accessToken) {
            console.log("No access token found");
            return;
        }

        const fetchBlogs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/blog`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.data && result.data.blogsAggregated && result.data.blogsAggregated.docs.length > 0) {
                    setBlogs(result.data.blogsAggregated.docs);
                } else {
                    console.log("No blogs available in API response");
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        const fetchUserId = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/user/current-user`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.data) {
                    setUserId(result.data.userId); // Set the userId from the API response
                } else {
                    console.log("Failed to fetch user ID");
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchBlogs();
        fetchUserId();
    }, [accessToken]);

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const l = blogs.length - 1;

    return (
        <div className='container mx-auto p-4 lg:px-20'>
            {blogs.length > 0 ? (
                <Link to={`/blog/${blogs[l]._id}`} className='block mb-4 py-4 px-6 duration-200 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-green-700 lg:p-0'>
                    <div className='flex flex-col items-start space-y-4 lg:space-y-6'>
                        {/* Category */}
                        <h1 className='text-green-500 text-lg md:text-xl lg:text-xl'>{blogs[l].category}</h1>
                        {/* Title */}
                        <h1 className='text-2xl md:text-3xl lg:text-4xl text-black-500 mb-3 font-bold'>{blogs[l].title}</h1>
                        {/* Image */}
                        <img className='w-full max-w-full h-auto rounded-lg shadow-lg' src={blogs[l].image} alt={blogs[l].title} />
                        {/* Content */}
                        <p className='text-sm md:text-base lg:text-base mt-4'>{truncateContent(blogs[l].content, 300)}</p>
                    </div>
                </Link>
            ) : (
                <p>No blog available</p>
            )}
            {blogs.length > 0 && (
                <div className='mt-4'>
                    <Comments blogId={blogs[l]._id} accessToken={accessToken} userId={userId} />
                </div>
            )}
        </div>
    );
}

export default Blog;
