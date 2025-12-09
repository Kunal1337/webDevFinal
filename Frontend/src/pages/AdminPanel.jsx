import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://webdevfinal-2.onrender.com';
const ADMIN_EMAIL = 'watchesauth372@gmail.com';

export default function AdminPanel() {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    description: '',
    image_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check if user is admin
  useEffect(() => {
    console.log("=== ADMIN PANEL DEBUG ===");
    console.log("Is Authenticated:", state.isAuthenticated);
    console.log("Username:", state.username);
    console.log("Expected Admin:", ADMIN_EMAIL);
    console.log("Match:", state.username === ADMIN_EMAIL);
    console.log("========================");

    if (!state.isAuthenticated) {
      alert('Please log in first!');
      navigate('/');
      return;
    }

    // Check username field since Asgardeo returns email there
    if (state.username !== ADMIN_EMAIL) {
      alert(`Access denied. Admins only!\n\nYour account: ${state.username}\nAdmin account: ${ADMIN_EMAIL}`);
      navigate('/');
    }
  }, [state, navigate]);

  // Fetch all watches
  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/watches`);
      const data = await response.json();
      setWatches(data);
    } catch (err) {
      console.error('Failed to fetch watches:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/api/upload-image`, {
        method: 'POST',
        body: uploadData
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
        alert('Image uploaded successfully!');
      }
    } catch (err) {
      alert('Failed to upload image');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddWatch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/watches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Watch added successfully!');
        setFormData({ brand: '', model: '', price: '', description: '', image_url: '' });
        setShowAddForm(false);
        fetchWatches();
      }
    } catch (err) {
      alert('Failed to add watch');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWatch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/watches/${editingWatch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Watch updated successfully!');
        setEditingWatch(null);
        setFormData({ brand: '', model: '', price: '', description: '', image_url: '' });
        fetchWatches();
      }
    } catch (err) {
      alert('Failed to update watch');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/watches/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Watch deleted successfully!');
        fetchWatches();
      }
    } catch (err) {
      alert('Failed to delete watch');
      console.error(err);
    }
  };

  const startEdit = (watch) => {
    setEditingWatch(watch);
    setFormData({
      brand: watch.brand,
      model: watch.model,
      price: watch.price,
      description: watch.description || '',
      image_url: watch.image_url || ''
    });
    setShowAddForm(false);
  };

  // Show loading or unauthorized message
  if (!state.isAuthenticated || state.username !== ADMIN_EMAIL) {
    return null; // Will redirect in useEffect
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f9fafb' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#111827' }}>
        Admin Panel - Manage Watches
      </h1>

      <button
        onClick={() => {
          setShowAddForm(!showAddForm);
          setEditingWatch(null);
          setFormData({ brand: '', model: '', price: '', description: '', image_url: '' });
        }}
        style={{
          background: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '20px'
        }}
      >
        {showAddForm ? 'Cancel' : '+ Add New Watch'}
      </button>

      {(showAddForm || editingWatch) && (
        <form
          onSubmit={editingWatch ? handleUpdateWatch : handleAddWatch}
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            {editingWatch ? 'Edit Watch' : 'Add New Watch'}
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ marginBottom: '10px' }}
              />
              {uploadingImage && <p style={{ color: '#6b7280' }}>Uploading...</p>}
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    marginTop: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Saving...' : editingWatch ? 'Update Watch' : 'Add Watch'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingWatch(null);
                setShowAddForm(false);
                setFormData({ brand: '', model: '', price: '', description: '', image_url: '' });
              }}
              style={{
                background: '#6b7280',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {watches.map((watch) => (
          <div
            key={watch.id}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {watch.image_url && (
              <img
                src={watch.image_url}
                alt={`${watch.brand} ${watch.model}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              />
            )}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>
              {watch.brand} {watch.model}
            </h3>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#10b981', marginBottom: '10px' }}>
              ${watch.price}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
              {watch.description}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => startEdit(watch)}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteWatch(watch.id)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}