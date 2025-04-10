import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-orange-700">E-Commerce</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Products</Link>
            <Link to="/categories" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Contact</Link>
          </nav>
          
          {/* User and Cart Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-36 lg:w-64 py-1 px-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg 
                className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-orange-700">
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
            </Link>
            
            {/* User dropdown */}
            <div className="relative">
              <button 
                onClick={toggleUserDropdown} 
                className="flex items-center text-gray-700 hover:text-orange-700 focus:outline-none"
              >
                <span className="mr-1">Account</span>
                <svg 
                  className={`h-4 w-4 transition-transform ${isUserDropdownOpen ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100">Sign In</Link>
                  <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100">Sign Up</Link>
                  <hr className="my-1" />
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100">My Account</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100">My Orders</Link>
                  <button 
                    onClick={() => console.log('Logout clicked')} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-700 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Products</Link>
              <Link to="/categories" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Categories</Link>
              <Link to="/about" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-700 px-3 py-2 font-medium">Contact</Link>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium">Account</span>
                <Link to="/cart" className="relative text-gray-700 hover:text-orange-700">
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                </Link>
              </div>
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link to="/login" className="text-gray-700 hover:text-orange-700 py-1">Sign In</Link>
                <Link to="/register" className="text-gray-700 hover:text-orange-700 py-1">Sign Up</Link>
                <Link to="/account" className="text-gray-700 hover:text-orange-700 py-1">My Account</Link>
                <Link to="/orders" className="text-gray-700 hover:text-orange-700 py-1">My Orders</Link>
                <button 
                  onClick={() => console.log('Logout clicked')} 
                  className="text-left text-gray-700 hover:text-orange-700 py-1"
                >
                  Sign Out
                </button>
              </div>
            </div>
            
            <div className="mt-4 px-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full py-1 px-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg 
                  className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header