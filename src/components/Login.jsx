import React from "react";
import { useNavigate } from "react-router-dom";  

const Login = () => {
  const navigate = useNavigate();  

  const handleGoogleSignIn = () => {
    // Placeholder 
    navigate('/category');
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>

        <button
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition mb-6 flex items-center justify-center"
          onClick={handleGoogleSignIn}
        >
          {/* Optional: Add a Google icon here */}
          Sign up or Login in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
