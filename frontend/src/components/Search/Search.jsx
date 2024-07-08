// src/components/Search/Search.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className='flex items-center mb-4 mr-2'>
      <FaSearch className='mr-2 ml-2' />
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className='border border-gray-300 p-2 w-full'
        placeholder='Search by category or title'
      />
    </div>
  );
}

export default Search;
