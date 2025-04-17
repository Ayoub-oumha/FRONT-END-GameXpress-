import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/cart/show');
      
      if (response.data) {
        setCartItems(response.data.items || []);
        
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
      setError('Failed to load your cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await axiosClient.put(`/cart/update/${itemId}`, { quantity: newQuantity });
      fetchCartItems(); // Refresh cart data
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }
    
    try {
      setUpdating(true);
      await axiosClient.delete(`/cart/remove/${itemId}`);
      fetchCartItems(); // Refresh cart data
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const getProductImageUrl = (item) => {
    const product = item.product;
    const baseUrl = "http://127.0.0.1:8000";
    
    if (product?.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
      
      if (primaryImage.image_url.startsWith('http')) {
        return primaryImage.image_url;
      }
      
      if (primaryImage.image_url.startsWith('/')) {
        return baseUrl + primaryImage.image_url;
      }
      
      return baseUrl + '/' + primaryImage.image_url;
    }
    
    return 'https://via.placeholder.com/150?text=' + encodeURIComponent(product.name);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-xl text-gray-700">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
            <button 
              onClick={fetchCartItems} 
              className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h2 className="mt-4 text-2xl font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        {updating && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
            <p className="flex items-center">
              <span className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></span>
              Updating your cart...
            </p>
          </div>
        )}
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart items table */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              {/* Desktop cart table */}
              <table className="hidden md:table w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img 
                              src={getProductImageUrl(item)} 
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-sm text-gray-500">{item.product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        ${formatPrice(item.unit_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                          >
                            <FaMinus className="h-3 w-3" />
                          </button>
                          <span className="text-gray-700 mx-2 border border-gray-300 rounded-md px-3 py-1 w-12 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                          >
                            <FaPlus className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        ${formatPrice(item.total_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mobile cart items */}
              <div className="md:hidden divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img 
                          src={getProductImageUrl(item)} 
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-sm text-gray-500">${formatPrice(item.unit_price)}</div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                        >
                          <FaMinus className="h-3 w-3" />
                        </button>
                        <span className="text-gray-700 mx-2 border border-gray-300 rounded-md px-3 py-1 w-12 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                        >
                          <FaPlus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right text-sm font-medium text-gray-900">
                        ${formatPrice(item.total_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Link 
                to="/products" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
              
              <button 
                onClick={fetchCartItems}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Update Cart
              </button>
            </div>
          </div>
          
          {/* Cart summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-sm font-medium text-gray-900">${formatPrice(cartTotals.subtotal)}</div>
                </div>
                
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Discount</div>
                    <div className="text-sm font-medium text-green-600">-${formatPrice(cartTotals.discount)}</div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Tax</div>
                  <div className="text-sm font-medium text-gray-900">${formatPrice(cartTotals.tax)}</div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <div className="text-base font-medium text-gray-900">Total</div>
                  <div className="text-base font-medium text-gray-900">${formatPrice(cartTotals.total)}</div>
                </div>
              </div>
              <div className="px-6 py-4">
                <Link 
                  to="/checkout" 
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Proceed to Checkout
                </Link>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <p className="text-xs text-gray-500">Secure checkout</p>
                </div>
              </div>
            </div>
            
            {/* Coupon code section */}
            <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
              <div className="px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Apply Coupon</h2>
                <div className="mt-4 flex">
                  <input
                    type="text"
                    className="flex-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    placeholder="Enter coupon code"
                  />
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;