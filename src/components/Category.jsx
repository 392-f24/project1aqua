import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Category = () => {
  const navigate = useNavigate();  // Initialize the navigation hook

  const handleSportsClick = () => {
    navigate('/podcast/sports');  // Redirect to the Sports Podcast page
  };

  const handleTechnologyClick = () => {
    navigate('/podcast/technology');
  };

  const handleMusicClick = () => {
    navigate('/podcast/music');
  };

  const handleNewsClick = () => {
    navigate('/podcast/news');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold mb-6">Select the Podcast Category</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={handleSportsClick}
        >
          Sports
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={handleTechnologyClick}
        >
          Technology
        </button>
        <button
          className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
          onClick={handleMusicClick}
        >
          Music
        </button>
        <button
          className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          onClick={handleNewsClick}
        >
          News
        </button>
      </div>
    </div>
  );
};

export default Category;
