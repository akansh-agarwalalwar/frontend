import { useEffect, useState } from 'react';
import Card from './Card';

export default function TelegramLinkCard({ panelMode }) {
  const [links, setLinks] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const username = JSON.parse(atob(token.split('.')[1])).username;
  const role = panelMode === 'admin' ? 'admin' : 'subadmin';

  // Fetch all telegram links
  useEffect(() => {
    fetch('https://swarg-store-backend.onrender.com/api/telegram-links')
      .then(res => res.json())
      .then(data => setLinks(Array.isArray(data) ? data : []))
      .catch(() => setLinks([]));
  }, []);

  // Add or update link
  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      let res, data;
      if (editingId) {
        res = await fetch(`https://swarg-store-backend.onrender.com/api/telegram-links/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ link: input }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update link');
        setLinks(links => links.map(l => l._id === editingId ? data : l));
        setMessage('Telegram link updated!');
      } else {
        res = await fetch('https://swarg-store-backend.onrender.com/api/telegram-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ link: input }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add link');
        setLinks(links => [...links, data]);
        setMessage('Telegram link added!');
      }
      setInput('');
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 1500);
    }
  };

  // Delete link
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://swarg-store-backend.onrender.com/api/telegram-links/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      alert("Deleted Successfully")
      if (!res.ok) throw new Error(data.error || 'Failed to delete link');
      setLinks(links => links.filter(l => l._id !== id));
      setMessage('Telegram link deleted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 1500);
    }
  };

  // Admin can edit/delete all, subadmin only their own
  const canEdit = (link) => {
    if (role === 'admin') return true;
    return link.addedBy && link.addedBy.username === username;
  };

  // Filter links for subadmin: only show own links
  const filteredLinks = role === 'subadmin'
    ? links.filter(link => link.addedBy && link.addedBy.username === username)
    : links;

  return (
    <Card className="max-w-xl mx-auto mt-8 bg-white border border-blue-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span>📢</span> Telegram Link
        </h2>
        <p className="text-gray-500 text-sm mt-1">Share your official Telegram group or channel for users to join.</p>
      </div>
      <div className="mb-6">
        <input
          type="url"
          placeholder="https://t.me/yourchannel"
          className="w-full px-4 py-2 rounded-md border-2 border-blue-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition mb-2"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow hover:from-blue-500 hover:to-blue-700"
            onClick={handleSave}
            disabled={!input || loading}
          >
            {editingId ? 'Update' : 'Save'}
          </button>
          {editingId && (
            <button
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200"
              onClick={() => { setEditingId(null); setInput(''); }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {error && <div className="text-red-400 font-semibold text-sm mt-2">{error}</div>}
      {message && <div className="text-green-500 font-semibold text-sm mt-2">{message}</div>}
      <div className="space-y-4">
        {filteredLinks.map(link => (
          <div key={link._id} className="flex items-center gap-3 bg-blue-50 rounded p-3">
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-semibold hover:text-blue-400 transition flex-1 truncate"
            >
              {link.link}
            </a>
            {link.addedBy && link.addedBy.username && (
              <span className="text-xs text-gray-500 italic mr-2">by {link.addedBy.username}</span>
            )}
            {canEdit(link) && (
              <>
                <button
                  className="px-3 py-1 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow hover:from-blue-500 hover:to-blue-700 ml-2"
                  onClick={() => { setEditingId(link._id); setInput(link.link); }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded-md bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold shadow hover:from-red-500 hover:to-pink-500 ml-2"
                  onClick={() => handleDelete(link._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
} 