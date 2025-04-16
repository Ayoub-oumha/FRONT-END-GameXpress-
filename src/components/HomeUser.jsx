import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

import '../HomeUser.css';

function HomeUser() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Fetch products and categories when component mounts
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axiosClient.post('/cart/add', { product_id: productId, quantity: 1 });
      showCartMessage('Product added to cart!', 'success');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showCartMessage('Failed to add product to cart', 'error');
    }
  };

  const buyNow = (productId) => {
    // Redirect to checkout page with this product
    window.location.href = `/checkout?product=${productId}`;
  };

  const showCartMessage = (message, type) => {
    setCartMessage({ text: message, type });
    setTimeout(() => setCartMessage(null), 3000);
  };

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Filter products based on selected category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category_id === activeCategory);

  return (
    <div className="home-user">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Shop</h1>
          <p>Discover amazing products at incredible prices</p>
          <button className="btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-filter">
        <h2>Browse by Category</h2>
        <div className="category-list">
          <button 
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => filterByCategory('all')}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => filterByCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products-section">
        <h2>Our Products</h2>
        
        {cartMessage && (
          <div className={`cart-message ${cartMessage.type}`}>
            {cartMessage.text}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <img 
                      src={product.image_url || 'https://via.placeholder.com/300x300?text=Product+Image'} 
                      alt={product.name} 
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price}</p>
                    <div className="product-actions">
                      <button 
                        className="btn-add-cart"
                        onClick={() => addToCart(product.id)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn-buy"
                        onClick={() => buyNow(product.id)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">No products found in this category.</p>
            )}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Free Delivery</h3>
          <p>On all orders over $50</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔄</div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payment</h3>
          <p>100% secure checkout</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💬</div>
          <h3>24/7 Support</h3>
          <p>Always here to help</p>
        </div>
      </section>
    </div>
  );
}

export default HomeUser;