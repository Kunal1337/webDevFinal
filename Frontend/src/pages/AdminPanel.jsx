import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';

const API_BASE = 'https://webdevfinal-2.onrender.com';

// List of admin emails (not usernames)
const ADMIN_EMAILS = ['watchesauth372@gmail.com'];

const AdminPanel = () => {
  const { state } = useAuthContext();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWatch, setEditingWatch] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    description: '',
    image_url: '',
  });

  // Check if user is admin - check both username and email
  const userIdentifier = state.username || state.email;
  const isAdmin = state.isAuthenticated && userIdentifier && 
    ADMIN_EMAILS.includes(userIdentifier.toLowerCase());

  useEffect(() => {
    if (isAdmin) {
      fetchWatches();
    }
  }, [isAdmin]);

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.username || state.email}`,
    };
  };

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/watches`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch watches');
      }
      
      const data = await response.json();
      setWatches(data);
    } catch (err) {
      console.error('Error fetching watches:', err);
      alert('Failed to fetch watches: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return null;

    try {
      setUploadingImage(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', selectedFile);

      const uploadResponse = await fetch(`${API_BASE}/api/upload-image`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      return uploadData.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image: ' + err.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      price: '',
      description: '',
      image_url: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingWatch(null);
    setShowAddForm(false);
  };

  const handleAddWatch = async () => {
    if (!formData.brand || !formData.model || !formData.price) {
      alert('Please fill in brand, model, and price');
      return;
    }

    try {
      // Upload image if file selected
      let imageUrl = formData.image_url;
      if (selectedFile) {
        const uploadedUrl = await handleUploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const response = await fetch(`${API_BASE}/api/admin/watches`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add watch');
      }

      alert('Watch added successfully!');
      resetForm();
      await fetchWatches();
    } catch (err) {
      console.error('Error adding watch:', err);
      alert('Failed to add watch: ' + err.message);
    }
  };

  const handleUpdateWatch = async (watchId) => {
    if (!formData.brand || !formData.model || !formData.price) {
      alert('Please fill in brand, model, and price');
      return;
    }

    try {
      // Upload image if file selected
      let imageUrl = formData.image_url;
      if (selectedFile) {
        const uploadedUrl = await handleUploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const response = await fetch(`${API_BASE}/api/admin/watches/${watchId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          price: parseFloat(formData.price),
          discontinued: watches.find(w => w.id === watchId)?.discontinued || false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update watch');
      }

      alert('Watch updated successfully!');
      resetForm();
      await fetchWatches();
    } catch (err) {
      console.error('Error updating watch:', err);
      alert('Failed to update watch: ' + err.message);
    }
  };

  const handleToggleDiscontinued = async (watchId, currentStatus) => {
    const action = currentStatus ? 'reactivate' : 'discontinue';
    if (!window.confirm(`Are you sure you want to ${action} this watch?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/watches/${watchId}/discontinue`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          discontinued: !currentStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }

      await fetchWatches();
    } catch (err) {
      console.error('Error toggling discontinued:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteWatch = async (watchId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this watch? This cannot be undone!')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/watches/${watchId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete watch');
      }

      alert('Watch deleted permanently');
      await fetchWatches();
    } catch (err) {
      console.error('Error deleting watch:', err);
      alert('Failed to delete watch: ' + err.message);
    }
  };

  const startEditing = (watch) => {
    setEditingWatch(watch.id);
    setFormData({
      brand: watch.brand,
      model: watch.model,
      price: watch.price,
      description: watch.description || '',
      image_url: watch.image_url || '',
    });
    setPreviewUrl(watch.image_url || '');
    setSelectedFile(null); // Clear file selection when editing
    setShowAddForm(false);
  };

  const startAdding = () => {
    resetForm();
    setShowAddForm(true);
  };

  if (!state.isAuthenticated) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">Please log in to access the admin panel</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-bold">Access Denied</p>
            <p>You do not have admin privileges</p>
            <p className="text-sm mt-2">Logged in as: {userIdentifier}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>
          <p className="text-white">Loading watches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-brandGold text-black px-4 py-2 rounded-lg font-semibold text-sm">
              Admin: {userIdentifier}
            </div>
            <button
              onClick={startAdding}
              className="btn bg-green-600 text-white border-green-600 hover:bg-green-700 whitespace-nowrap"
            >
              + Add New Watch
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm">Total Watches</p>
            <p className="text-2xl font-bold text-gray-800">{watches.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm">Active Watches</p>
            <p className="text-2xl font-bold text-green-600">
              {watches.filter(w => !w.discontinued).length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm">Discontinued</p>
            <p className="text-2xl font-bold text-red-600">
              {watches.filter(w => w.discontinued).length}
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingWatch) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editingWatch ? 'Edit Watch' : 'Add New Watch'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGold"
                  placeholder="e.g., Rolex"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGold"
                  placeholder="e.g., Submariner"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price * ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGold"
                  placeholder="e.g., 9999.99"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image Preview
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGold"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGold"
                  placeholder="Enter watch description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image File (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brandGold file:text-white hover:file:bg-yellow-700"
                />
                {(previewUrl || formData.image_url) && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <img 
                      src={selectedFile ? previewUrl : formData.image_url} 
                      alt="Preview" 
                      className="w-48 h-48 object-cover rounded-lg shadow"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('Image failed to load');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => editingWatch ? handleUpdateWatch(editingWatch) : handleAddWatch()}
                disabled={uploadingImage}
                className="flex-1 btn bg-brandGold text-white border-brandGold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? 'Uploading Image...' : (editingWatch ? 'Update Watch' : 'Add Watch')}
              </button>
              <button
                onClick={resetForm}
                disabled={uploadingImage}
                className="flex-1 btn remove"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Watches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watches.map((watch) => (
            <div 
              key={watch.id} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
                watch.discontinued ? 'opacity-60 grayscale' : ''
              }`}
            >
              {/* Watch Image */}
              <div className="relative h-64 bg-gray-100">
                {watch.image_url ? (
                  <img 
                    src={watch.image_url} 
                    alt={`${watch.brand} ${watch.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
                    ID: {watch.id}
                  </div>
                  {watch.discontinued && (
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      DISCONTINUED
                    </div>
                  )}
                </div>
              </div>

              {/* Watch Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {watch.brand} {watch.model}
                </h3>
                <p className="text-brandGold font-bold text-xl mb-2">
                  ${parseFloat(watch.price).toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {watch.description || 'No description available'}
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(watch)}
                      className="flex-1 btn-small bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleDiscontinued(watch.id, watch.discontinued)}
                      className={`flex-1 btn-small ${
                        watch.discontinued 
                          ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                          : 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700'
                      }`}
                    >
                      {watch.discontinued ? 'Reactivate' : 'Discontinue'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteWatch(watch.id)}
                    className="w-full btn-small remove"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {watches.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No watches in database</p>
            <button
              onClick={startAdding}
              className="btn"
            >
              Add Your First Watch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;