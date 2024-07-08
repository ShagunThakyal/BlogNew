import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RelatedBlogs from './RelatedBlogs.jsx';
import Comments from '../Comments/Comments';

function BlogDetails() {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchBlogById = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/blog/${blogId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                const result = await response.json();
                if (result.data) {
                    setBlog(result.data);
                }
            } catch (error) {
                console.error('Error fetching blog details:', error);
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
                    setUserId(result.data.userId);
                } else {
                    console.log("Failed to fetch user ID");
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchBlogById();
        fetchUserId();
    }, [blogId, accessToken]);

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-5 lg:px-20">
            <div className="w-full lg:w-[80%] mx-auto">
                {/* Blog Details Section */}
                <div>
                    <h1 className='text-green-500 text-lg md:text-xl lg:text-xl'>{blog.category}</h1>
                    <h1 className='text-2xl md:text-3xl lg:text-5xl text-black-500 mb-3 font-bold'>{blog.title}</h1>
                    <img className='w-full h-auto mx-auto rounded-lg shadow-lg' src={blog.image} alt={blog.title} />
                    <p className='mt-5 mb-2 text-sm md:text-base lg:text-lg'>{blog.content}</p>
                </div>

                {/* Comments Section */}
                <div className="mt-10">
                    <Comments blogId={blogId} accessToken={accessToken} userId={userId} />
                </div>

                {/* Related Blogs Section */}
                <div className="mt-10">
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Related Blogs</h1>
                    <RelatedBlogs category={blog.category} currentBlogId={blogId} />
                </div>
            </div>
        </div>
    );
}

export default BlogDetails;
