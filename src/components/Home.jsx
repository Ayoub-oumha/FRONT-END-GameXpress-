import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Logout failed. Please try again.');
      console.error('Logout error:', err);
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
          <h2 className="text-xl font-semibold mb-4">
            Welcome to your dashboard{user ? `, ${user.name}` : ''}
          </h2>
          <p className="text-gray-600">Your content will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;