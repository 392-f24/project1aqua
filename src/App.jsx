import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Category from "./components/Category";
import Podcast from "./components/Podcast";
import StorageTester from "./components/storageTester";
import DatabaseTester from './components/databaseTester';
import SignInOut from './components/SignInOut';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-red-300 p-4">
        <Routes>
          {/* Login */}
          {/* <Route path="/" element={<Login />} />*/}
          <Route path="/" element={<SignInOut />} />

          {/* Category */}
          <Route path="/category" element={<Category />} />

          {/* Dynamic Podcast Route */}
          <Route path="/podcast/:category" element={<Podcast />} />

          {/* Storage Tester */}
          <Route path="/storageTester" element={<StorageTester />} />

          {/* Database Tester */}
          <Route path="/databaseTester" element={<DatabaseTester />} />

          

        </Routes>
      </div>
    </Router>
  );
}


export default App;
