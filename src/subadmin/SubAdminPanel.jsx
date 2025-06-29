import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AllPostedIDs from '../admin/MyPostedIDs';
import Card from '../components/Card';
import YouTubeVideos from '../components/YouTubeVideos';
import TelegramLinkCard from '../components/TelegramLinkCard';
import MediaUpload from '../components/MediaUpload';

function SubAdminPanel() {
  const [section, setSection] = useState('all');
  const [bgmiForm, setBgmiForm] = useState({
    title: '',
    price: '',
    description: '',
    media: [], // Changed to array for multiple files
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBgmiChange = (e) => {
    const { name, value } = e.target;
    setBgmiForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Media files handler
  const handleMediaChange = (files) => {
    setBgmiForm(prev => ({
      ...prev,
      media: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!bgmiForm.title || !bgmiForm.price) {
      setError('Title and Price are required');
      setLoading(false);
      return;
    }
    if (bgmiForm.media.length === 0) {
      setError('Please upload at least one media file (image or video)');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', bgmiForm.title);
      formData.append('price', bgmiForm.price);
      formData.append('description', bgmiForm.description);
      
      // Append all media files
      bgmiForm.media.forEach(file => {
        if (file.type.startsWith('image/')) {
          formData.append('image', file);
        } else if (file.type.startsWith('video/')) {
          formData.append('video', file);
        }
      });

      const res = await fetch('http://localhost:5000/api/ids/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to post BGMI ID');
      }

      setSuccess('BGMI ID posted successfully!');
      setBgmiForm({ title: '', price: '', description: '', media: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen gap-8 bg-white">
      <Sidebar current={section} onSectionChange={setSection} />
      <div className="flex-1 py-8 overflow-y-auto p-4 bg-white">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition text-base sm:text-lg gaming-button"
          >
            Logout
          </button>
        </div>
        {section === 'bgmi' && (
          <Card header={<span className="text-blue-600">Add BGMI ID to Sell</span>} className="max-w-4xl mx-auto p-8">
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1" htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter product title"
                    className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                    value={bgmiForm.title}
                    onChange={handleBgmiChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1" htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                    value={bgmiForm.price}
                    onChange={handleBgmiChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  value={bgmiForm.description}
                  onChange={handleBgmiChange}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Media Files</label>
                <MediaUpload 
                  onFilesChange={handleMediaChange}
                  maxFiles={10}
                  acceptedTypes="image/*,video/*"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition text-lg gaming-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Create BGMI ID'}
              </button>

              {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
              {success && <p className="text-green-400 mt-2 text-center">{success}</p>}
            </form>
          </Card>
        )}
        {section === 'all' && <AllPostedIDs />}
        {section === 'youtube' && <YouTubeVideos mode="subadmin" />}
        {section === 'telegram' && <TelegramLinkCard panelMode="subadmin" />}
      </div>
    </div>
  );
}

export default SubAdminPanel;
