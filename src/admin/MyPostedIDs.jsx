import Card from '../components/Card';
import React, { useState, useEffect } from 'react';

const bgmiPlaceholderImage = "https://prod.assets.earlygamecdn.com/images/BGMI-3.5-Update.png?transform=Article+Webp";

export default function MyPostedIDs() {
  const [myIDs, setMyIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    fetch('https://swarg-store-backend.onrender.com/api/ids/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMyIDs(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load your posted IDs'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`https://swarg-store-backend.onrender.com/api/ids/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      setMyIDs(ids => ids.map(row => row._id === id ? { ...row, status: newStatus } : row));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://swarg-store-backend.onrender.com/api/ids/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete ID');
      setMyIDs(ids => ids.filter(row => row._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-8 neon-text">My Posted IDs</h2>
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-blue-500 py-12 font-bold animate-pulse">Loading...</div>
      ) : myIDs.length === 0 ? (
        <div className="text-center text-gray-500 py-12">You have not posted any IDs yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myIDs.map((row) => (
            <div key={row._id} className="group relative bg-white rounded-lg shadow-lg border border-blue-100 hover:shadow-2xl hover:shadow-blue-400/20 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-blue-50 group-hover:opacity-90 transition-opacity relative">
                {row.media && row.media.length > 0 && row.media[0]?.type === 'image' ? (
                  <img 
                    src={row.media[0].url || bgmiPlaceholderImage} 
                    alt={row.title}
                    className="h-48 w-full object-cover object-center" 
                  />
                ) : row.media && row.media.length > 0 && row.media[0]?.type === 'video' ? (
                  <video 
                    src={row.media[0].url || bgmiPlaceholderImage} 
                    className="h-48 w-full object-cover object-center" 
                    controls 
                  />
                ) : (
                  <img 
                    src={bgmiPlaceholderImage} 
                    alt="BGMI 3.6 Update"
                    className="h-48 w-full object-cover object-center" 
                  />
                )}
                {/* SOLD OUT badge at top right */}
                {row.status === 'sold' && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-1 line-clamp-2 group-hover:text-blue-500 transition-colors">
                  {row.title}
                </h3>
                <p className="text-xs text-gray-400 mb-2">ID: {row._id.slice(-8)}</p>
                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-green-600">₹{row.price?.toLocaleString?.() ?? row.price}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'sold' ? 'bg-red-100 text-red-600 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
                  }`}>
                    {row.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </div>
                {/* Status Selector */}
                <div className="mt-2">
                  <select
                    value={row.status}
                    onChange={e => handleStatusChange(row._id, e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-xs font-bold border-2 focus:ring-2 focus:ring-blue-400 outline-none transition bg-white text-blue-700 ${
                      row.status === 'sold' ? 'bg-red-100 text-red-600 border-red-300' : 'bg-green-100 text-green-700 border-green-300'
                    }`}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                {/* Delete Button */}
                <button
                  className="w-full mt-2 py-2 px-4 rounded-md text-xs font-bold bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg hover:from-red-500 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-white"
                  onClick={() => handleDelete(row._id)}
                >
                  Delete
                </button>
              </div>
              {/* Gaming corner accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 