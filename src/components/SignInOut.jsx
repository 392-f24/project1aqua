import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, useAuthState } from '../utilities/firebase';
import logo from '../logo.svg';

const Spinner = () => (
    <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
    </div>
);

const SignInForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            navigate('/category');
        } catch (error) {
            console.error('Error signing in:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#5f6f52' }}>
            <div className="text-center flex flex-col items-center">
                <img src={logo} width={300} alt="Logo" className="mb-6" />
                <h3 className="text-white text-3xl font-bold mb-4">
                    Transforming News into Engaging Podcasts
                </h3>
                <p className="text-gray-300 mb-8">
                    Sign up to listen to up-to-date podcasts on the latest news, powered by AI.
                </p>
                {loading ? (
                    <Spinner />
                ) : (
                    <button
                        onClick={handleSignIn}
                        className="flex items-center justify-center py-3 rounded-lg text-white shadow-md hover:shadow-lg transition-shadow duration-300"
                        style={{
                            backgroundColor: '#FEFAE0',
                            color: '#4a4a4a',
                            fontWeight: 'bold',
                            width: '90%', // Adjust width to 90% of its container
                            maxWidth: '360px', // Maximum width to not be too wide on larger screens
                        }}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M47.531 24.552c0-1.632-.132-3.272-.415-4.877H24.479v9.242h12.963c-.538 2.98-2.266 5.617-4.797 7.293v6.997h7.734c4.541-4.18 7.152-10.353 7.152-17.655z" fill="#4285F4"/>
                            <path d="M24.479 48c6.473 0 11.931-2.125 15.909-5.794l-7.734-6.997c-1.634 1.098-3.734 1.746-6.175 1.746-4.264 0-7.873-2.883-9.165-6.762H3.032v6.716C7.106 42.887 15.405 48 24.479 48z" fill="#34A853"/>
                            <path d="M15.294 28.6a9.986 9.986 0 0 1 0-6.399V15.485H3.033a16.138 16.138 0 0 0 0 14.232l12.261-7.117z" fill="#FBBC05"/>
                            <path d="M24.479 9.499c3.42-.053 6.727 1.234 9.205 3.598l6.852-6.852C36.199 2.17 30.441-.07 24.479 0 15.405 0 7.106 5.116 3.032 13.23l12.262 6.182c1.292-3.879 4.902-6.762 9.185-6.762z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </button>
                )}
            </div>
        </main>
    );
};

const SignInOut = () => {
    const [user] = useAuthState();

    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignInForm />
        </div>
    );
};

export default SignInOut;
