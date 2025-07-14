import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <header className="green-gradient p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">Herbal Wellness</Link>
      <nav className="space-x-4">
        {user ? (
          <>
            <Link to="/" className="text-white hover:underline">Home</Link>
            <Link to="/profile" className="text-white hover:underline">Profile</Link>
            <Link to="/forum" className="text-white hover:underline">Forum</Link>
            <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup" className="text-white hover:underline">Sign Up</Link>
            <Link to="/login" className="text-white hover:underline">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;