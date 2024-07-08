import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout/layout.jsx'
import Login from './components/Login/login.jsx'
import Register from './components/Register/register.jsx'
import Home from './components/Home/Home.jsx'
import CreateBlog from './components/Blog/CreateBlog.jsx'
import Profile from './components/Profile/Profile.jsx'
import EditProfile from './components/Profile/EditProfile.jsx'
import EditBlog from './components/Blog/EditBlog.jsx'
import BlogDetails from './components/Blog/BlogDetails.jsx'
import SearchResults from './components/Search/SearchResults.jsx' // Ensure SearchResults is imported

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='createBlog' element={<CreateBlog />} />
      <Route path='profile' element={<Profile />} />
      <Route path='editProfile' element={<EditProfile />} />
      <Route path='editBlog/:blogId' element={<EditBlog />} /> {/* Correct parameter name */}
      <Route path="/blog/:blogId" element={<BlogDetails />} />
      <Route path="/search" element={<SearchResults />} /> {/* Added route for SearchResults */}
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
