import React, { useEffect, useState } from 'react';
import './Button.css';
import { Link, useLocation } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({ type, onClick, buttonStyle, buttonSize }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [location]);

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        setIsLoggedIn(false);
    };

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <>
            {isLoggedIn ? (
                <button
                    className={`btn ${checkButtonStyle} ${checkButtonSize}`}
                    onClick={handleLogout}
                    type={type}
                >
                    Logout
                </button>
            ) : (
                <Link to='/login' className='btn-mobile'>
                    <button
                        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
                        onClick={onClick}
                        type={type}
                    >
                        Login
                    </button>
                </Link>
            )}
        </>
    );
};
