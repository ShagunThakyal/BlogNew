import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditBlog() {
  const { blogId } = useParams(); // Get the blog ID from the URL parameters
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Added to navigate programmatically

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/blog/${blogId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setBlog(result.data);
          setTitle(result.data.title);
          setCategory(result.data.category);
          setContent(result.data.content);
          setImage(result.data.image);
        } else {
          console.error('Failed to fetch blog:', response.statusText);
          setError('Failed to fetch blog');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('An error occurred while fetching the blog');
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('content', content);
      formData.append('image', image);

      const response = await fetch(`http://localhost:3000/api/v1/blog/${blogId}`, {
        method: 'PATCH',  // Use PATCH method for partial updates
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate('/profile');  // Redirect to the profile page after successful update
      } else {
        const errorResponse = await response.json();
        console.error('Failed to update blog:', errorResponse);
        setError('Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('An error occurred while updating the blog');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Edit Blog</h1>
      {error && <p className="text-red-500">{error}</p>}
      {blog ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label htmlFor="title" className="block text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="category" className="block text-gray-700">Category</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="content" className="block text-gray-700">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows="6"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="image" className="block text-gray-700">Image URL</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Update Blog
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
