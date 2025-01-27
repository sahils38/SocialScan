import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth'; // Adjust the path if needed

const Navbar = () => {
  const { user, setUser, logout } = useAuth(); // Get user, setUser, and logout function from context
  const navigate = useNavigate();

  // Retrieve user data from localStorage on page load
  useEffect(() => {
    const persistedUser = localStorage.getItem('user');
    if (persistedUser) {
      setUser(JSON.parse(persistedUser)); // Set the user in the AuthContext
    }
  }, [setUser]);

  const handleLogout = async () => {
    try {
      logout(); // Call the logout function from the context
      localStorage.removeItem('user'); // Clear the persisted user from localStorage
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out');
    }
  };

  return (
    <nav className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-xl font-bold text-white">SocialScan</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium">
                  Welcome, {user.departmentName} {/* Display the department name */}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Officer Login
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Access Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
