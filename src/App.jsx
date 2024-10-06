import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Category from './components/Category';
import Podcast from './components/Podcast';  

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-red-300 p-4">
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />
          
          {/* Category */}
          <Route path="/category" element={<Category />} />

          {/* Podcast */}
          <Route path="/podcast/sports" element={<Podcast />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
