import React from 'react'
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signOut, useAuthState } from '../utilities/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


// NavLink Header Component
// for signing in and out of FlashBrief account

const SignInButton = () => {
    const navigate = useNavigate();

    const handleSignIn = async () => {
        await signInWithGoogle(); // Sign in with Google
        //createUserWithEmailAndPassword()
        navigate('/category'); // Redirect to /category after signing in
    };
  
    return (
      <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition mb-6 flex items-center justify-center"
       onClick={handleSignIn}>
        Sign in with Google
      </button>
    );
};

const SignInForm = () => {
    return (
        <div className="d-flex justify-content-center align-items-center"
        style={{ background: 'linear-gradient(white, red)' }}>
            <form id="signup-form" className="p-4 border rounded" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="mb-3">
                    <label htmlFor="signup-email" className="form-label">Email address</label>
                    <input type="email" id="signup-email" className="form-control" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="signup-password" className="form-label">Choose Password</label>
                    <input type="password" id="signup-password" className="form-control" required />
                </div>
                <button type="submit" className="btn btn-warning w-100">
                    Sign Up - NOT READY YET
                </button>
            </form>
        </div>
    );
};





const SignInOut = () => {
    const [user] = useAuthState();
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
                <h1>{user ? `Welcome, ${user.displayName}` : 'Please Sign In'}</h1>
                <nav className="d-flex">
                    <SignInButton /> {/* This renders either the SignInButton or SignOutButton */}
                    <SignInForm />
                </nav>
            </div>
        </div>
    );
  };

export default SignInOut;