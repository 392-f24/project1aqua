import React from "react";
import { useNavigate } from "react-router-dom";  
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();  

  const handleSignIn = () => {
    // do auth
    navigate('/category');  // Navigate to the category page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Hey, Welcome Back</h2>

        <div className="input-group">
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="input-group">
          <label>Your Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="login-btn" onClick={handleSignIn}>Sign In</button>

        <button className="google-btn">Sign in with Google</button>

        <p className="signup-text">
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
