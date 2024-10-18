import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg'; // Adjust the path as needed

export default function SignOutNav({ children }) {
    const navigate = useNavigate();

    // Function to handle logo click and navigate to /category
    const handleClick = () => {
        navigate('/category');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <>
            {/* Container for the logo and background color */}
            <div
                style={{
                    width: '100%',
                    backgroundColor: '#5F6F52', // Green background color
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem 0',
                    zIndex: 1000,
                }}
            >
                {/* The Logo */}
                <img
                    src={logo}
                    alt="Logo"
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to go to category"
                    className="logo cursor-pointer"
                    style={{
                        width: 'clamp(150px, 10vw + 200px, 450px)', // Exponential-like scaling using clamp
                        height: 'auto', // Maintain aspect ratio
                    }}
                />
            </div>

            {/* Other Content Below the Logo */}
            <div style={{ padding: '0 20px' }}>{children}</div>
        </>
    );
}
