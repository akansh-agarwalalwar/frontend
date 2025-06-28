import { useEffect, useState } from 'react';
import Card from './Card';

export default function TelegramLinkCard({ panelMode }) {
  const [currentLink, setCurrentLink] = useState(null);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const token = localStorage.getItem('token');
  const role = panelMode === 'admin' ? 'admin' : 'subadmin';

  // Fetch subadmin's telegram link
  const fetchSubAdminLink = async () => {
    if (role !== 'subadmin') return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://swarg-store-backend.onrender.com/api/telegram-links/subadmin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status === 404) {
        // No link exists yet
        setCurrentLink(null);
        return;
      }
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch telegram link');
      }
      
      const data = await res.json();
      setCurrentLink(data);
      setInput(data.link || '');
    } catch (err) {
      if (err.message !== 'Telegram link not found for this subadmin') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all telegram links for admin
  const fetchAllLinks = async () => {
    if (role !== 'admin') return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://swarg-store-backend.onrender.com/api/telegram-links');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch links');
      setCurrentLink({ links: Array.isArray(data) ? data : [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'subadmin') {
      fetchSubAdminLink();
    } else if (role === 'admin') {
      fetchAllLinks();
    }
  }, [role]);

  // Create or update subadmin's telegram link
  const handleSave = async () => {
    if (role !== 'subadmin') return;
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('https://swarg-store-backend.onrender.com/api/telegram-links/subadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ link: input }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save telegram link');
      
      setCurrentLink(data.telegramLink);
      setMessage(data.message || 'Telegram link saved successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Admin operations
  const handleAdminSave = async () => {
    if (role !== 'admin') return;
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      let res, data;
      
      if (editingLinkId) {
        // Update existing link
        res = await fetch(`https://swarg-store-backend.onrender.com/api/telegram-links/${editingLinkId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ link: input }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update telegram link');
        setMessage('Telegram link updated successfully!');
      } else {
        // Create new link
        res = await fetch('https://swarg-store-backend.onrender.com/api/telegram-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ link: input }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create telegram link');
        setMessage('Telegram link created successfully!');
      }
      
      // Refresh the list
      await fetchAllLinks();
      setInput('');
      setEditingLinkId(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Delete subadmin's telegram link
  const handleDelete = async () => {
    if (role !== 'subadmin') return;
    
    if (!window.confirm('Are you sure you want to delete your telegram link?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('https://swarg-store-backend.onrender.com/api/telegram-links/subadmin', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete telegram link');
      
      setCurrentLink(null);
      setInput('');
      setMessage(data.message || 'Telegram link deleted successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Admin delete operation
  const handleAdminDelete = async (linkId) => {
    if (role !== 'admin') return;
    
    if (!window.confirm('Are you sure you want to delete this telegram link?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch(`https://swarg-store-backend.onrender.com/api/telegram-links/${linkId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete telegram link');
      
      setMessage('Telegram link deleted successfully!');
      await fetchAllLinks(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Start editing
  const handleEdit = () => {
    setIsEditing(true);
    setInput(currentLink?.link || '');
  };

  // Admin edit operation
  const handleAdminEdit = (link) => {
    setIsEditing(true);
    setEditingLinkId(link._id);
    setInput(link.link);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setInput(currentLink?.link || '');
    setEditingLinkId(null);
    setError('');
  };

  // Refresh link
  const handleRefresh = () => {
    if (role === 'subadmin') {
      fetchSubAdminLink();
    } else if (role === 'admin') {
      fetchAllLinks();
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-8 bg-white border border-blue-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span>📢</span> Telegram Link
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {role === 'subadmin' 
            ? 'Manage your telegram link for users to contact you.'
            : 'Manage all telegram links in the system.'
          }
        </p>
      </div>

      {role === 'subadmin' && (
        <div className="mb-6">
          {!isEditing ? (
            <div className="space-y-4">
              {currentLink ? (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Link:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <a
                    href={currentLink.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-semibold hover:text-blue-400 transition break-all"
                  >
                    {currentLink.link}
                  </a>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No telegram link set. Add one to help users contact you.
                </div>
              )}
              
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow hover:from-blue-500 hover:to-blue-700 transition"
                disabled={loading}
              >
                {currentLink ? 'Update Link' : 'Add Link'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://t.me/yourusername"
                className="w-full px-4 py-2 rounded-md border-2 border-blue-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow hover:from-blue-500 hover:to-blue-700 transition"
                  onClick={handleSave}
                  disabled={!input.trim() || loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {role === 'admin' && (
        <div className="space-y-4">
          {/* Add/Edit Form for Admin */}
          {isEditing && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {editingLinkId ? 'Edit Telegram Link' : 'Add New Telegram Link'}
              </h3>
              <input
                type="url"
                placeholder="https://t.me/username"
                className="w-full px-4 py-2 rounded-md border-2 border-blue-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition mb-3"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow hover:from-blue-500 hover:to-blue-700 transition"
                  onClick={handleAdminSave}
                  disabled={!input.trim() || loading}
                >
                  {loading ? 'Saving...' : (editingLinkId ? 'Update' : 'Add')}
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Admin Controls */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">All Telegram Links</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                disabled={loading}
              >
                Add New
              </button>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Links List */}
          {currentLink?.links && currentLink.links.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No telegram links found.
            </div>
          ) : (
            currentLink?.links?.map(link => (
              <div key={link._id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline font-semibold hover:text-blue-400 transition break-all"
                    >
                      {link.link}
                    </a>
                    {link.addedBy && (
                      <div className="text-xs text-gray-500 mt-1">
                        Added by: {link.addedBy.username || 'Unknown'} ({link.addedByRole})
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAdminEdit(link)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAdminDelete(link._id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <div className="text-red-500 font-semibold text-sm mt-4 p-3 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
      
      {message && (
        <div className="text-green-600 font-semibold text-sm mt-4 p-3 bg-green-50 rounded border border-green-200">
          {message}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}
    </Card>
  );
} 