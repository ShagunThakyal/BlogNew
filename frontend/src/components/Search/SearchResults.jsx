import React from 'react';
import BlogSmall from '../Blog/BlogSmall.jsx';
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  // Function to capitalize the first letter of each word
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className='w-[80%] mx-auto mt-5'>
      {/* Display the search query as a heading with the first letter of each word capitalized */}
      <h2 className='text-5xl font-bold mb-2'>{capitalizeWords(searchQuery)}</h2>
      <BlogSmall searchQuery={searchQuery} />
    </div>
  );
}

export default SearchResults;

