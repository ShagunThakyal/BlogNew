import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons from react-icons

function MyBlogs() {
  const accessToken = localStorage.getItem('accessToken');
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState({});
  const [user, setUser] = useState(null);
  const [hoveredBlogId, setHoveredBlogId] = useState(null);
  const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState(null);
  const navigate = useNavigate(); // Added to navigate programmatically

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/v1/user/current-user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
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
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      console.log('No access token found');
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/blog', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
        if (response.ok) {
          const result = await response.json();
          setBlogs(result.data.blogsAggregated.docs);
        } else {
          console.error('Failed to fetch blogs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, [accessToken]);

  useEffect(() => {
    const fetchAuthors = async () => {
      for (const blog of blogs) {
        if (blog.author) {
          try {
            const response = await fetch(`http://localhost:3000/api/v1/user/${blog.author}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              credentials: 'include',
            });
            if (response.ok) {
              const result = await response.json();
              setAuthors((prevAuthors) => ({
                ...prevAuthors,
                [blog._id]: result.data.username,
              }));
            } else {
              console.error(`Failed to fetch author for blog ${blog._id}:`, response.statusText);
            }
          } catch (error) {
            console.error(`Error fetching author for blog ${blog._id}:`, error);
          }
        }
      }
    };

    fetchAuthors();
  }, [blogs, accessToken]);

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const capitalizeFirstLetter = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredBlogs = blogs.filter((blog) => blog.author === user?.userId);

  const handleEdit = (blogId) => {
    // Navigate to the EditBlog page with the blog ID as a URL parameter
    navigate(`/editBlog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (!accessToken) {
      console.log('No access token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
        setConfirmDeleteBlogId(null); // Reset confirmation state
      } else {
        const errorResponse = await response.json();
        console.error('Error deleting blog:', errorResponse);
        alert('Failed to delete blog: ' + (errorResponse.message || response.statusText));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('An error occurred while deleting the blog. Please try again.');
    }
  };

  const handleBlogClick = (blogId) => {
    setHoveredBlogId((prevId) => (prevId === blogId ? null : blogId));
  };

  return (
    <div className="container mx-auto p-4">
      {filteredBlogs.length === 0 ? (
        <h1 className="text-2xl font-bold mt-2 text-center">You haven't posted any blogs yet.</h1>
      ) : (
        filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => handleBlogClick(blog._id)}
            className={`relative mb-6 p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100`}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image Section */}
              <div className="w-full lg:w-1/3 flex-shrink-0">
                <img
                  className="h-[200px] w-full object-cover rounded-lg"
                  src={blog.image}
                  alt={blog.title}
                />
              </div>

              {/* Title and Category Section */}
              <div className="w-full lg:w-2/3 flex flex-col justify-between">
                <div>
                  <h1 className={`text-2xl font-bold mt-2 ${hoveredBlogId === blog._id ? 'text-green-600' : ''}`}>
                    {capitalizeFirstLetter(blog.title)}
                  </h1>
                  <h1 className="text-green-600 font-semibold">
                    {capitalizeFirstLetter(blog.category || 'Category')}
                  </h1>
                </div>
                <div>
                  <h1 className="mt-3 font-semibold">
                    {capitalizeFirstLetter(authors[blog._id] || 'Loading author...')}
                  </h1>
                  <h1 className="text-gray-400 font-semibold">
                    {new Date(blog.createdAt).toLocaleString()}
                  </h1>
                </div>
                <p className="text-base text-gray-500 mt-2">{truncateContent(blog.content, 250)}</p>
              </div>
            </div>

            {/* Buttons for both small and large devices */}
            {(hoveredBlogId === blog._id || confirmDeleteBlogId === blog._id) && (
              <>
                {confirmDeleteBlogId === blog._id ? (
                  <div className="absolute top-2 right-2 flex flex-col gap-2 mt-2 lg:flex lg:items-center lg:justify-center lg:opacity-100 lg:bg-white lg:shadow-md lg:rounded-lg lg:p-2 lg:w-auto lg:z-10">
                    <span className="text-red-500 font-semibold text-center">
                      Are you sure?
                    </span>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteBlogId(null)} // Cancel deletion
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 flex flex-col gap-2 mt-2 lg:flex lg:items-center lg:justify-center lg:opacity-100 lg:bg-white lg:shadow-md lg:rounded-lg lg:p-2 lg:w-auto lg:z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(blog._id); // Pass blog ID to handleEdit
                      }}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteBlogId(blog._id); // Show confirmation UI
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBlogs;
