import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styleCategory.css'; // You'll need to create this CSS file
import axiosClient from '../api/axiosClient';

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/admin/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories. Please try again later.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setIsEditing(false);
    setFormData({
      name: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategoryId(category._id);
    setFormData({
      name: category.name,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/categories/${currentCategoryId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/categories', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError(isEditing ? 'Failed to update category.' : 'Failed to add category.');
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect products associated with this category.')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category.');
        console.error('Error deleting category:', err);
      }
    }
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Category Management</h1>
        <button className="add-button" onClick={handleOpenModal}>
          Add New Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="category-table-container">
          <table className="category-table">
            <thead>
              <tr>
             
                <th>Name</th>
                {/* <th>Products Count</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id}>
                   
                    <td>{category.name}</td>
                    {/* <td>{category.productsCount || 0}</td> */}
                    <td className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-categories">No categories found</td>
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
              <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Category Name</label>
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
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditing ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;