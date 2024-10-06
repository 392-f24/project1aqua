import React from 'react';
import { useParams } from 'react-router-dom';

const Podcast = () => {
  const { category } = useParams(); // Extract the category from the URL parameters


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-4">{category} Podcast</h2>
        <p className="text-center text-gray-700">
          This is a {category} podcast.
        </p>
      </div>
    </div>
  );
};

export default Podcast;

