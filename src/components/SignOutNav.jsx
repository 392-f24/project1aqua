import React from 'react';
import { signInWithGoogle, signOut, useAuthState } from '../utilities/firebase';
import { FaUser } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

// Nav Header
// Displays sign in and sign out links

const SignOutButton = () => (
    <button
    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
    onClick={signOut}
    >
      Sign Out
    </button>
);
  
const SignInButton = () => {
    const navigate = useNavigate();
    const handleSignIn = async () => {
        navigate('/'); // nav to sign in page
      };
    
    return (
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          onClick={handleSignIn}
        >
          Sign In
        </button>
    );
};
  
const AuthButton = () => {
    const [user] = useAuthState();
    return user ? <SignOutButton /> : <SignInButton />;
};
  
export default function SignOutNav() {
    const [user] = useAuthState(); // Get the authentication state
    return (
        <div className="flex justify-between items-center bg-white shadow-md p-4">
            <h1 className="text-lg font-bold">FlashBrief</h1> {/* Title or Logo */}
            <AuthButton />
        </div>
  );
}