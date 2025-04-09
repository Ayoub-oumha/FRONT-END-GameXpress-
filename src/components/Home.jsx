import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call logout API with token in header
      await axios.post(
        'http://127.0.0.1:8000/api/v1/admin/logout',
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      navigate('/login');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
      console.error('Logout error:', err.response?.data || err);
      
      // If token is invalid/expired, force logout anyway
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-orange-700">Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            onClick={handleLogout}
            disabled={loading}
            className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Your dashboard content goes here */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
          <p className="text-gray-600">Your content will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;    