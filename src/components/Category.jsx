import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './Category.css';

const Category = () => {
  const navigate = useNavigate();  // Initialize the navigation hook

  const handleSportsClick = () => {
    navigate('/podcast/sports');  // Redirect to the Sports Podcast page
  };

  return (
    <div className="category-container">
      <h2>Select the Podcast Category</h2>
      <div className="category-list">
        <button className="category-btn" onClick={handleSportsClick}>Sports</button>
        <button className="category-btn">Technology</button>
        <button className="category-btn">Music</button>
        <button className="category-btn">News</button>
      </div>
    </div>
  );
};

export default Category;
