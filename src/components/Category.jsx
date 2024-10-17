import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import SignOutNav from './SignOutNav';

const Category = () => {
  const navigate = useNavigate();  // Initialize the navigation hook

  const handleSportsClick = () => {
    navigate('/podcast/Sports');  // Redirect to the Sports Podcast page
  };

  const handleTechnologyClick = () => {
    navigate('/podcast/Technology');
  };

  const handleMusicClick = () => {
    navigate('/podcast/Music');
  };

  const handleNewsClick = () => {
    navigate('/podcast/News');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SignOutNav /> {/* This will now be at the top */}
      <div className="flex-grow flex flex-col items-center justify-center" 
      style ={{backgroundColor:'#5f6f52'}}>
      <h2 className="text-3xl font-semibold mb-6">Choose a Podcast Category</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          className="px-6 py-3 text-black rounded-md hover:bg-blue-600 transition"
          style={{ backgroundColor: '#fefae0' }}
          onClick={handleSportsClick}
        >
          Sports
        </button>
        <button
          className="px-6 py-3 text-black rounded-md hover:bg-green-600 transition"
          style={{ backgroundColor: '#fefae0' }}
          onClick={handleTechnologyClick}
        >
          Technology
        </button>
        <button
          className="px-6 py-3 text-black rounded-md hover:bg-purple-600 transition"
          style={{ backgroundColor: '#fefae0' }}
          onClick={handleMusicClick}
        >
          Music
        </button>
        <button
          className="px-6 py-3 text-black rounded-md hover:bg-red-600 transition"
          style={{ backgroundColor: '#fefae0' }}
          onClick={handleNewsClick}
        >
          News
        </button>
      </div>
    </div>
    </div>
  );
};

export default Category;
