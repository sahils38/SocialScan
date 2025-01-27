import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { db } from '../firebase/firebaseConfig'; // Update path if needed
import { collection, addDoc } from 'firebase/firestore';

const Register = () => {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentId: '',
    officerName: '',
    badgeNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
   
    try {
      // Add department details to Firestore
      const departmentRef = collection(db, "departments");
      await addDoc(departmentRef, {
        departmentName: formData.departmentName,
        departmentId: formData.departmentId,
        officerName: formData.officerName,
        badgeNumber: formData.badgeNumber,
        email: formData.email,
        password: formData.password, // You may want to hash this later for security
      });

      // Navigate to login after successful registration
      navigate('/login');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Register Department</h2>
          <p className="mt-2 text-gray-400">Create an account for your law enforcement agency</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">Department Name</label>
                <input
                  type="text"
                  name="departmentName"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Department ID</label>
                <input
                  type="text"
                  name="departmentId"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Officer Name</label>
                <input
                  type="text"
                  name="officerName"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Badge Number</label>
                <input
                  type="text"
                  name="badgeNumber"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Department
              </button>
            </div>

            <div className="text-center text-gray-400">
              Already registered? <Link to="/login" className="text-blue-500 hover:text-blue-400">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
