import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styleProduct.css'; // You'll need to create this CSS file
import axiosClient from '../api/axiosClient';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    slug: '',
    category_id : '',
    stock: '',
    status:'',
    image : null ,
  });
  const [currentProductId, setCurrentProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories(); 
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get('/admin/categories');
      setCategories(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/admin/products'); // Adjust the endpoint as needed;
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category_id: '',
      stock: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      category_id: product.category_id,
      stock: product.stock
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value , files } = e.target;
    if (name === 'image') {
        setFormData((prev) => ({ ...prev, image: files[0] }));
    }
    else {
         setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosClient.put(`/admin/products/${currentProductId}`, formData);
      } else {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("slug", formData.slug);
        form.append("price", formData.price);
        form.append("category_id", formData.category_id);
        form.append("stock", formData.stock);
        form.append("status", formData.status);
        form.append("image", formData.image); // File input
  
        await axiosClient.post('/admin/products', form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(isEditing ? 'Failed to update product.' : 'Failed to add product.');
      console.error('Error saving product:', err);
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosClient.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product.');
        console.error('Error deleting product:', err);
      }
    }
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find( cat => cat.id == categoryId)
    return category ? category.name : "Unknown Category" ;
    // console.log(category ? category.name : "Unknown Category")
    // return category.name ;
  }
//   getCategoryName(1);
  


  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Product Management</h1>
        <button className="add-button" onClick={handleOpenModal}>
          Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                {/* <th>Description</th> */}
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.primary_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'} 
                        alt={product.name}
                        className="product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    {/* <td className="description-cell">{product.description}</td> */}
                    <td>${product.price}</td>
                    <td>{getCategoryName(product.category_id)}</td>
                    <td>{product.stock}</td>
                    <td className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-products">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Product slug</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
              <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="category-select w-full p-3"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
              <label htmlFor="status">Status</label>
                <select  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="status-select , w-full p-3">
                    <option value="">Select status</option>
                    <option value="available">available</option>
                    <option value="out_of_stock">out of stock</option>
                </select>
               
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                //   value={formData.image}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditing ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;