import { useState, useEffect } from 'react';
import Card from '../components/Card';

export default function AllPostedIDs({ search = '' }) {
  const [allIDs, setAllIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/ids')
      .then(res => res.json())
      .then(data => setAllIDs(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load IDs'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'sold' ? 'available' : 'sold';
      const res = await fetch(`http://localhost:5000/api/ids/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      setAllIDs(ids => ids.map(row => row._id === id ? { ...row, status: newStatus } : row));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ids/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete ID');
      setAllIDs(ids => ids.filter(row => row._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = allIDs.filter(
    (id) =>
      id.title.toLowerCase().includes(search.toLowerCase()) ||
      (id.postedBy?.username || '').toLowerCase().includes(search.toLowerCase())
  );

  // Temporary BGMI image placeholder
  const bgmiPlaceholderImage = "https://prod.assets.earlygamecdn.com/images/BGMI-3.5-Update.png?transform=Article+Webp";

  return (
    <div className="mb-8 p-3">
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && <div className="col-span-full text-center py-12 text-cyan-400 font-bold animate-pulse">Loading...</div>}
        {filtered.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-500 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">No products found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
        {filtered.map((row) => {
          const postedByName = row.postedBy?.username || 'Unknown';
          return (
            <div key={row._id} className="group relative bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl hover:shadow-blue-400/20 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 group-hover:opacity-90 transition-opacity relative">
                {row.media && row.media.length > 0 && row.media[0]?.type === 'image' ? (
                  <img 
                    src={`http://localhost:5000${row.media[0].url}`} 
                    alt={row.title}
                    className="h-48 w-full object-cover object-center" 
                  />
                ) : row.media && row.media.length > 0 && row.media[0]?.type === 'video' ? (
                  <video 
                    src={`http://localhost:5000${row.media[0].url}`} 
                    className="h-48 w-full object-cover object-center" 
                    controls 
                  />
                ) : (
                  // Use BGMI placeholder image when no media is available
                  <img 
                    src={bgmiPlaceholderImage} 
                    alt="BGMI 3.6 Update"
                    className="h-48 w-full object-cover object-center" 
                  />
                )}
                {/* SOLD OUT badge at top right */}
                {row.status === 'sold' && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                    SOLD OUT
                  </span>
                )}
                {/* Gaming overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {row.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">ID: {row._id.slice(-8)}</p>
                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-green-600">
                  ₹{row.price.toLocaleString()}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'sold' 
                      ? 'bg-red-100 text-red-700 border border-red-300' 
                      : 'bg-green-100 text-green-700 border border-green-300'
                  }`}>
                    {row.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </div>
                {/* Seller Info */}
                <div className="text-xs text-gray-600 mb-3">
                  <span className="font-medium text-gray-700">Seller:</span> {postedByName} ({row.role})
                </div>
                {/* Additional Media Thumbnails */}
                {row.media && row.media.length > 1 && (
                  <div className="flex gap-1 mb-4">
                    {row.media.slice(1, 4).map((m, idx) =>
                      m.type === 'image' ? (
                        <img
                          key={idx}
                          src={`http://localhost:5000${m.url}`}
                          alt="media"
                          className="w-8 h-8 rounded object-cover border border-gray-300 hover:border-blue-400 transition-colors"
                        />
                      ) : (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded border border-gray-300 bg-gray-100 flex items-center justify-center hover:border-blue-400 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
                      )
                    )}
                    {row.media.length > 4 && (
                      <div className="w-8 h-8 rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500">+{row.media.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}
                {/* Action Button */}
                <button
                  className={`w-full py-2 px-4 rounded-md text-sm font-bold transition-all duration-200 transform hover:scale-105 ${
                    row.status === 'sold'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white shadow-lg hover:shadow-blue-400/25'
                  }`}
                  disabled={row.status === 'sold'}
                  onClick={() => {
                    if (row.status !== 'sold' && row.telegramLink) {
                      window.open(row.telegramLink, '_blank');
                    }
                  }}
                >
                  {row.status === 'sold' ? 'Sold Out' : 'Buy Now'}
                </button>
                {/* Admin status toggle button */}
                <button
                  className="w-full mt-2 py-2 px-4 rounded-md text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white"
                  onClick={() => handleToggleStatus(row._id, row.status)}
                >
                  Change Status to {row.status === 'sold' ? 'Available' : 'Sold'}
                </button>
                {/* Admin delete button */}
                <button
                  className="w-full mt-2 py-2 px-4 rounded-md text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white"
                  onClick={() => handleDelete(row._id)}
                >
                  Delete
                </button>
              </div>
              {/* Gaming corner accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 