import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SubAdminActivity from './SubAdminActivity';
import AllPostedIDs from './AllPostedIDs';
import Card from '../components/Card';
import ManageSubadmins from './ManageSubadmins';
import MyPostedIDs from './MyPostedIDs';
import YouTubeVideos from '../components/YouTubeVideos';
import TelegramLinkCard from '../components/TelegramLinkCard';

function AdminPanel() {
  const [section, setSection] = useState('all');
  const navigate = useNavigate();
  // Dummy data for sub admins
  const [subAdmins, setSubAdmins] = useState([
    { id: 1, username: 'subadmin1', name: 'Sub Admin 1', email: 'sub1@example.com' },
    { id: 2, username: 'subadmin2', name: 'Sub Admin 2', email: 'sub2@example.com' },
  ]);
  const [newSubAdmin, setNewSubAdmin] = useState({ username: '', name: '', email: '', password: '' });
  const [bgmiForm, setBgmiForm] = useState({ title: '', price: '', description: '', media: null });

  // CRUD handlers for sub admins
  const addSubAdmin = () => {
    if (!newSubAdmin.username || !newSubAdmin.name || !newSubAdmin.email || !newSubAdmin.password) return;
    setSubAdmins([...subAdmins, { ...newSubAdmin, id: Date.now() }]);
    setNewSubAdmin({ username: '', name: '', email: '', password: '' });
  };
  const deleteSubAdmin = (id) => setSubAdmins(subAdmins.filter(sa => sa.id !== id));

  // BGMI ID form handler
  const handleBgmiChange = (e) => {
    const { name, value, files } = e.target;
    setBgmiForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // BGMI ID submit handler
  const handleBgmiSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!bgmiForm.title || !bgmiForm.price || !bgmiForm.media) {
      alert('Title, price, and media are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', bgmiForm.title);
    formData.append('price', bgmiForm.price);
    formData.append('description', bgmiForm.description);
    if (bgmiForm.media) {
      if (bgmiForm.media.type && bgmiForm.media.type.startsWith('image/')) {
        formData.append('image', bgmiForm.media);
      } else if (bgmiForm.media.type && bgmiForm.media.type.startsWith('video/')) {
        formData.append('video', bgmiForm.media);
      } else {
        alert('Unsupported media file type');
        return;
      }
    }
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
      setBgmiForm({ title: '', price: '', description: '', media: null });
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
        {section === 'subadmins' && <SubAdminActivity />}
        {section === 'create' && (
          <Card header={<span className="text-blue-600">Create BGMI ID to Sell</span>} className="max-w-2xl mx-auto p-8">
            <form className="space-y-6" onSubmit={handleBgmiSubmit} encType="multipart/form-data">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Title</label>
                <input type="text" name="title" placeholder="Title" className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition" value={bgmiForm.title} onChange={handleBgmiChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Price</label>
                <input type="number" name="price" placeholder="Price" className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition" value={bgmiForm.price} onChange={handleBgmiChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea name="description" placeholder="Description" className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition" value={bgmiForm.description} onChange={handleBgmiChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Photo/Video</label>
                <input type="file" name="media" accept="image/*,video/*" className="w-full border border-blue-200 rounded px-3 py-2 bg-white text-gray-900" onChange={handleBgmiChange} />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition text-lg gaming-button">Create</button>
            </form>
          </Card>
        )}
        {section === 'all' && <AllPostedIDs />}
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
        {section === 'myPosted' && <MyPostedIDs />}
        {section === 'youtube' && <YouTubeVideos mode="admin" />}
        {section === 'telegram' && <TelegramLinkCard panelMode="admin" />}
      </div>
    </div>
  );
}

export default AdminPanel; 