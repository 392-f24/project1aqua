import React from 'react';
import { useParams } from 'react-router-dom';
import Player from './Player';
import SignOutNav from './SignOutNav';

const Podcast = () => {
  const { category } = useParams(); // Extract the category from the URL parameters


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SignOutNav />
      <div className="flex-grow flex items-center justify-center p-4 bg-gray-800">
        <div className="w-full max-w-lg p-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-4">Your Daily {category} Update</h2>
          <div className="flex justify-center">
            <Player category={category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;

