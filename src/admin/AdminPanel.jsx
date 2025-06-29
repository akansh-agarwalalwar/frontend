import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SubAdminActivity from './SubAdminActivity';
import AllPostedIDs from './AllPostedIDs';
import SoldIDs from './SoldIDs';
import Card from '../components/Card';
import ManageSubadmins from './ManageSubadmins';
import MyPostedIDs from './MyPostedIDs';
import YouTubeVideos from '../components/YouTubeVideos';
import TelegramLinkCard from '../components/TelegramLinkCard';
import MediaUpload from '../components/MediaUpload';

function AdminPanel() {
  const [section, setSection] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  // Dummy data for sub admins
  const [subAdmins, setSubAdmins] = useState([
    { id: 1, username: 'subadmin1', name: 'Sub Admin 1', email: 'sub1@example.com' },
    { id: 2, username: 'subadmin2', name: 'Sub Admin 2', email: 'sub2@example.com' },
  ]);
  const [newSubAdmin, setNewSubAdmin] = useState({ username: '', name: '', email: '', password: '' });
  const [bgmiForm, setBgmiForm] = useState({ 
    title: '', 
    price: '', 
    description: '', 
    media: [] 
  });

  // CRUD handlers for sub admins
  const addSubAdmin = () => {
    if (!newSubAdmin.username || !newSubAdmin.name || !newSubAdmin.email || !newSubAdmin.password) return;
    setSubAdmins([...subAdmins, { ...newSubAdmin, id: Date.now() }]);
    setNewSubAdmin({ username: '', name: '', email: '', password: '' });
  };
  const deleteSubAdmin = (id) => setSubAdmins(subAdmins.filter(sa => sa.id !== id));

  // BGMI ID form handler
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

  // BGMI ID submit handler
  const handleBgmiSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!bgmiForm.title || !bgmiForm.price) {
      alert('Title and price are required.');
      return;
    }
    
    if (bgmiForm.media.length === 0) {
      alert('Please upload at least one media file.');
      return;
    }

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

    try {
      const res = await fetch('https://swarg-store-backend.onrender.com/api/ids/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create BGMI ID');
      alert('BGMI ID created successfully!');
      setBgmiForm({ title: '', price: '', description: '', media: [] });
    } catch (err) {
      alert(err.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen gap-8 bg-white">
      <Sidebar current={section} onSectionChange={setSection} mode="admin" />
      <div className="flex-1 py-8 overflow-y-auto p-4 bg-white">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition text-base sm:text-lg gaming-button"
          >
            Logout
          </button>
        </div>
        
        {/* Search Bar for relevant sections */}
        {(section === 'all' || section === 'sold' || section === 'myPosted') && (
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search by title or seller..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-blue-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {section === 'subadmins' && <SubAdminActivity />}
        {section === 'create' && (
          <Card header={<span className="text-blue-600">Create BGMI ID to Sell</span>} className="max-w-4xl mx-auto p-8">
            <form className="space-y-6" onSubmit={handleBgmiSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    placeholder="Enter product title" 
                    className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition" 
                    value={bgmiForm.title} 
                    onChange={handleBgmiChange} 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Price</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="Enter price" 
                    className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition" 
                    value={bgmiForm.price} 
                    onChange={handleBgmiChange} 
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea 
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
                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition text-lg gaming-button"
              >
                Create BGMI ID
              </button>
            </form>
          </Card>
        )}
        {section === 'all' && <AllPostedIDs search={search} />}
        {section === 'manageSubadmins' && (
          <ManageSubadmins
            subAdmins={subAdmins}
            setSubAdmins={setSubAdmins}
            newSubAdmin={newSubAdmin}
            setNewSubAdmin={setNewSubAdmin}
            addSubAdmin={addSubAdmin}
            deleteSubAdmin={deleteSubAdmin}
          />
        )}
        {section === 'myPosted' && <MyPostedIDs search={search} />}
        {section === 'youtube' && <YouTubeVideos mode="admin" />}
        {section === 'telegram' && <TelegramLinkCard panelMode="admin" />}
        {section === 'sold' && <SoldIDs search={search} />}
      </div>
    </div>
  );
}

export default AdminPanel; 