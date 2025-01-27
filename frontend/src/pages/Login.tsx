import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Officer } from '../types'; // Import Officer type

const Login = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Get setUser function from context

  // Check localStorage for persisted login on page load
  useEffect(() => {
    const persistedUser = localStorage.getItem('user');
    if (persistedUser) {
      const user: Officer = JSON.parse(persistedUser);
      setUser(user);
      navigate('/dashboard'); // Redirect to dashboard if user exists
    }
  }, [navigate, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const officersRef = collection(db, 'departments');
      const q = query(
        officersRef,
        where('departmentName', '==', departmentName),
        where('badgeNumber', '==', badgeNumber),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the officer data from Firestore
        const officerData = querySnapshot.docs[0].data(); // Get the first matching officer

        // Construct the user object with all the required fields
        const user: Officer = {
          departmentName: officerData.departmentName,
          badgeNumber: officerData.badgeNumber,
          password: officerData.password,
          uid: querySnapshot.docs[0].id, // Add unique ID
        };

        // Set the user in context (so Navbar can reflect login status)
        setUser(user);

        // Persist user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-900">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Officer Authentication
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="department-name" className="sr-only">
                Department Name
              </label>
              <input
                id="department-name"
                name="department"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="badge-number" className="sr-only">
                Badge Number
              </label>
              <input
                id="badge-number"
                name="badge"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Badge Number"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Access Investigation Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
