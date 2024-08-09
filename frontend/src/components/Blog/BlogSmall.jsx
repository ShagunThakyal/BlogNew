import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function BlogSmall({ searchQuery = '' }) {
  const accessToken = localStorage.getItem('accessToken');
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (!accessToken) {
      console.log("No access token found");
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/blog`, {
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

    fetchBlogs();
  }, [accessToken]);

  useEffect(() => {
    const fetchAuthors = async () => {
      for (const blog of blogs) {
        if (blog.author) {
          try {
            const response = await fetch(`${apiUrl}/user/${blog.author}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`
              },
              credentials: 'include',
            });
            const result = await response.json();
            setAuthors(prevAuthors => ({
              ...prevAuthors,
              [blog._id]: result.data.username
            }));
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
    return text.replace(/\b\w/g, char => char.toUpperCase());
  };

  // Ensure searchQuery is a string and convert it to lowercase
  const query = (searchQuery || '').toLowerCase();

  // Filter blogs based on searchQuery
  const filteredBlogs = blogs.filter(blog => {
    const title = blog.title ? blog.title.toLowerCase() : '';
    const category = blog.category ? blog.category.toLowerCase() : '';
    return title.includes(query) || category.includes(query);
  });

  return (
    <div className='p-4'>
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map(blog => (
          <NavLink
            key={blog._id}
            to={`/blog/${blog._id}`} // Ensure the route matches the actual blog route
            className={({ isActive }) =>
              `block py-2 pr-4 pl-3 duration-200
               ${isActive ? "text-green-500 opacity-50" : "text-black-500 opacity-100"}
               border-b border-gray-100
               hover:bg-gray-50 lg:hover:bg-transparent
               lg:border-0 hover:text-green-700 lg:p-0`
            }
          >
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Title and Category Section */}
              <div className='flex flex-col justify-between w-full lg:w-1/3'>
                <div>
                  <h1 className='text-green-600 font-semibold text-left text-lg md:text-xl lg:text-lg'>{capitalizeFirstLetter(blog.category || 'Category')}</h1>
                  <h1 className='text-xl md:text-2xl lg:text-2xl font-bold mt-2 text-left'>{capitalizeFirstLetter(blog.title)}</h1>
                </div>
                <div>
                  <h1 className='mt-3 font-semibold text-left'>{capitalizeFirstLetter(authors[blog._id] || 'Loading author...')}</h1>
                  <h1 className='text-gray-400 font-semibold text-left'>{new Date(blog.createdAt).toLocaleString()}</h1>
                </div>
              </div>

              {/* Content Section */}
              <div className='flex flex-col justify-between w-full lg:w-1/3'>
                <p className='text-base text-gray-500 mt-2 text-left'>{truncateContent(blog.content, 250)}</p>
              </div>

              {/* Image Section */}
              <div className='flex items-center w-full lg:w-1/3'>
                <img className='h-[200px] w-full object-cover' src={blog.image} alt={blog.title} />
              </div>

            </div>
            <div className='border-t-4 border-gray-200 w-auto my-4 lg:my-8 block'></div>

          </NavLink>
          
        ))
      ) : (
        <p>No blogs available for this search query</p>
      )}
    </div>
  );
}

export default BlogSmall;
