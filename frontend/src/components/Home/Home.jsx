import React, { useState } from 'react';
import Blog from '../Blog/Blog.jsx';
import BlogSmall from '../Blog/BlogSmall.jsx';
import Search from '../Search/Search.jsx'; // Import the Search component
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleCategoryClick = (category) => {
        setSearchQuery(category);
        navigate(`/search?query=${category}`);
    };

    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Sidebar */}
            <div className='sidebar w-[14vw] flex flex-col items-center mt-16 pr-2 hidden lg:flex'>
                <div className='text-2xl font-semibold text-gray-800'>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('Startup')}>Startup</h2>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('Venture')}>Venture</h2>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('Apple')}>Apple</h2>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('AI')}>AI</h2>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('Apps')}>Apps</h2>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('Events')}>Events</h2>
                    <h2 className='mt-10 cursor-pointer hover:text-green-700 text-center' onClick={() => handleCategoryClick('More')}>More</h2>
                </div>
            </div>
            
            {/* Vertical Line */}
            <div className='border-r-4 border-gray-200 h-auto mx-4 lg:mx-8 hidden lg:block'></div>
            
            {/* Main Content Area */}
            <div className='w-full lg:w-[72%] mt-5'>
                {/* Search Component */}
                <Search 
                    searchQuery={searchQuery} 
                    onSearchChange={handleSearchChange} 
                    className='lg:ml-0 ml-4'  // Add margin-left for small screens
                />

                {/* Blog Content */}
                <Blog />

                <div className='border-t-4 border-gray-200 w-auto my-4 lg:my-8 block'></div>

                {/* BlogSmall Content */}
                <BlogSmall searchQuery={searchQuery} />
            </div>

            {/* Vertical Line at the end of the blog */}
            <div className='border-r-4 border-gray-200 h-auto mx-4 lg:mx-8 hidden lg:block'></div>
        </div>
    );
}

