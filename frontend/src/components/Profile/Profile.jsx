import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyBlogs from '../Blog/MyBlogs.jsx';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

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
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row relative">
      {/* Sidebar (hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-[12%] lg:justify-center">
        {/* Sidebar content (if any) */}
      </div>

      <div className="w-full lg:w-[76%] lg:ml-0 flex flex-col items-center lg:items-start mt-5 z-10 px-4 lg:px-0">
        {user && (
          <div className="profile-header w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start p-8 bg-white shadow-lg rounded-lg">
            <div className="profile-image w-40 h-40 flex-shrink-0 mb-4 lg:mb-0 lg:mr-10">
              <img
                className="rounded-full w-full h-full object-cover"
                src={user.avatar || 'https://via.placeholder.com/150'}
                alt={user.username}
              />
            </div>
            <div className="profile-info flex flex-col items-center lg:items-start">
              <div className="flex flex-col lg:flex-row items-center mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold mr-0 lg:mr-6">{user.username}</h1>
                <Link to="/editProfile">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300 mt-4 lg:mt-0">
                    Edit Profile
                  </button>
                </Link>
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">{user.fullName}</h2>
              <p className="text-base lg:text-lg text-gray-600 mb-2">{user.bio}</p>
            </div>
          </div>
        )}

        <div className="w-full mt-12">
          <h1 className="text-4xl lg:text-6xl text-black-500 mb-6 ml-0 lg:ml-0 font-bold">My Blogs</h1>
          <MyBlogs />
        </div>
      </div>
    </div>
  );
}

