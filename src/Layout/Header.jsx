import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch cart data when component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);
  
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/cart/show');
      
      // Handle the structure of your API response
      if (response.data) {
        setCartItems(response.data.items || []);
        setCartCount(response.data.items ? response.data.items.length : 0);
        
        // Set cart totals from the response
        if (response.data.totals) {
          setCartTotals({
            subtotal: response.data.totals.subtotal || 0,
            discount: response.data.totals.discount || 0,
            tax: response.data.totals.tax || 0,
            total: response.data.totals.total || 0
          });
        } else if (response.data.cart) {
          // Fallback to cart data if totals not available
          setCartTotals({
            subtotal: parseFloat(response.data.cart.subtotal) || 0,
            discount: parseFloat(response.data.cart.discount_amount) || 0,
            tax: parseFloat(response.data.cart.tax_amount) || 0,
            total: parseFloat(response.data.cart.total_amount) || 0
          });
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Could not load cart items');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    if (isCartOpen) setIsCartOpen(false);
  };
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
  };
  
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };
  
  const getProductImageUrl = (item) => {
    // Access the product object inside the item
    const product = item.product;
    const baseUrl = "http://127.0.0.1:8000";
    
    // Check if product has images array and it's not empty
    if (product?.images && product.images.length > 0) {
      // Find primary image or use the first one
      const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
      
      // If the image_url already starts with http, return as is
      if (primaryImage.image_url.startsWith('http')) {
        return primaryImage.image_url;
      }
      
      // If image path starts with /storage, append to base URL
      if (primaryImage.image_url.startsWith('/')) {
        return baseUrl + primaryImage.image_url;
      }
      
      // Otherwise, ensure proper path formatting
      return baseUrl + '/' + primaryImage.image_url;
    }
    
    // Return a placeholder if no images available
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW1yhlTpkCnujnhzP-xioiy9RdDQkKLMnMSg&s";
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
            
            {/* Cart with dropdown */}
            <div className="relative">
              <button 
                onClick={toggleCart}
                className="relative text-gray-700 hover:text-orange-700 focus:outline-none"
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-medium">Your Cart ({cartCount} items)</h3>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-3 text-center text-gray-500">Loading cart...</div>
                    ) : error ? (
                      <div className="px-4 py-3 text-center text-red-500">{error}</div>
                    ) : cartItems.length === 0 ? (
                      <div className="px-4 py-3 text-center text-gray-500">Your cart is empty</div>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.id} className="px-4 py-2 hover:bg-gray-50 flex items-center">
                          <div className="w-12 h-12 flex-shrink-0 mr-2">
                            <img 
                              src={getProductImageUrl(item)} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                            <p className="text-sm text-gray-500">{item.quantity} × ${formatPrice(item.unit_price)}</p>
                          </div>
                          <div className="ml-2">
                            <span className="text-sm font-medium text-gray-900">
                              ${formatPrice(item.total_price)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-200">
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm text-gray-900">${formatPrice(cartTotals.subtotal)}</span>
                    </div>
                    
                    {cartTotals.discount > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className="text-sm text-green-600">-${formatPrice(cartTotals.discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="text-sm text-gray-900">${formatPrice(cartTotals.tax)}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 pt-3 border-t border-gray-100">
                      <span className="font-medium">Total:</span>
                      <span className="font-medium">${formatPrice(cartTotals.total)}</span>
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      <Link 
                        to="/cart" 
                        className="w-1/2 bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm text-center hover:bg-gray-300 transition-colors"
                        onClick={() => setIsCartOpen(false)}
                      >
                        View Cart
                      </Link>
                      <Link 
                        to="/checkout" 
                        className="w-1/2 bg-orange-600 text-white py-2 px-4 rounded text-sm text-center hover:bg-orange-700 transition-colors"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
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
          <div className="md:hidden flex items-center space-x-4">
            {/* Mini cart indicator for mobile */}
            <button 
              onClick={toggleCart}
              className="relative text-gray-700 hover:text-orange-700 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>
            
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
          </div>
        )}
        
        {/* Cart dropdown for mobile */}
        {isCartOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium">Your Cart ({cartCount} items)</h3>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-3 text-center text-gray-500">Loading cart...</div>
              ) : error ? (
                <div className="px-4 py-3 text-center text-red-500">{error}</div>
              ) : cartItems.length === 0 ? (
                <div className="px-4 py-3 text-center text-gray-500">Your cart is empty</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="px-4 py-2 hover:bg-gray-50 flex items-center">
                    <div className="w-12 h-12 flex-shrink-0 mr-2">
                      <img 
                        src={getProductImageUrl(item)} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} × ${formatPrice(item.unit_price)}</p>
                    </div>
                    <div className="ml-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${formatPrice(item.total_price)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm text-gray-900">${formatPrice(cartTotals.subtotal)}</span>
              </div>
              
              {cartTotals.discount > 0 && (
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm text-green-600">-${formatPrice(cartTotals.discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Tax:</span>
                <span className="text-sm text-gray-900">${formatPrice(cartTotals.tax)}</span>
              </div>
              
              <div className="flex justify-between py-2 pt-3 border-t border-gray-100">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${formatPrice(cartTotals.total)}</span>
              </div>
              
              <div className="mt-2 flex space-x-2">
                <Link 
                  to="/cart" 
                  className="w-1/2 bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm text-center hover:bg-gray-300 transition-colors"
                  onClick={() => setIsCartOpen(false)}
                >
                  View Cart
                </Link>
                <Link 
                  to="/checkout" 
                  className="w-1/2 bg-orange-600 text-white py-2 px-4 rounded text-sm text-center hover:bg-orange-700 transition-colors"
                  onClick={() => setIsCartOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;