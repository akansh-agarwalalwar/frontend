import { useState, useEffect } from 'react';
import Card from '../components/Card';

export default function SoldIDs({ search = '' }) {
  const [allIDs, setAllIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalSold: 0,
    totalRevenue: 0,
    soldToday: 0,
    soldThisWeek: 0,
    soldThisMonth: 0
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    fetch('https://swarg-store-backend.onrender.com/api/ids')
      .then(res => res.json())
      .then(data => {
        const soldIDs = Array.isArray(data) ? data.filter(id => id.status === 'sold') : [];
        setAllIDs(soldIDs);
        
        // Calculate statistics
        const totalRevenue = soldIDs.reduce((sum, id) => sum + (id.price || 0), 0);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate());
        
        const soldToday = soldIDs.filter(id => {
          const soldDate = new Date(id.updatedAt || id.createdAt);
          return soldDate >= today;
        }).length;
        
        const soldThisWeek = soldIDs.filter(id => {
          const soldDate = new Date(id.updatedAt || id.createdAt);
          return soldDate >= weekAgo;
        }).length;
        
        const soldThisMonth = soldIDs.filter(id => {
          const soldDate = new Date(id.updatedAt || id.createdAt);
          return soldDate >= monthAgo;
        }).length;
        
        setStats({
          totalSold: soldIDs.length,
          totalRevenue,
          soldToday,
          soldThisWeek,
          soldThisMonth
        });
      })
      .catch(() => setError('Failed to load sold IDs'))
      .finally(() => setLoading(false));
  }, []);

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
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalSold}</div>
          <div className="text-sm text-gray-600">Total Sold</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.soldToday}</div>
          <div className="text-sm text-gray-600">Sold Today</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.soldThisWeek}</div>
          <div className="text-sm text-gray-600">Sold This Week</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.soldThisMonth}</div>
          <div className="text-sm text-gray-600">Sold This Month</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && <div className="col-span-full text-center py-12 text-cyan-400 font-bold animate-pulse">Loading...</div>}
        {filtered.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-500 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">No sold products found</h3>
            <p className="mt-2 text-gray-500">No IDs have been sold yet.</p>
          </div>
        )}
        {filtered.map((row) => {
          const postedByName = row.postedBy?.username || 'Unknown';
          const soldDate = new Date(row.updatedAt || row.createdAt).toLocaleDateString();
          return (
            <div key={row._id} className="group relative bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl hover:shadow-green-400/20 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 group-hover:opacity-90 transition-opacity relative">
                {row.media && row.media.length > 0 && row.media[0]?.type === 'image' ? (
                  <img 
                    src={`https://swarg-store-backend.onrender.com${row.media[0].url}`} 
                    alt={row.title}
                    className="h-48 w-full object-cover object-center" 
                  />
                ) : row.media && row.media.length > 0 && row.media[0]?.type === 'video' ? (
                  <video 
                    src={`https://swarg-store-backend.onrender.com${row.media[0].url}`} 
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
                {/* SOLD badge at top right */}
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                  SOLD
                </span>
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    Sold
                  </span>
                </div>
                {/* Seller Info */}
                <div className="text-xs text-gray-600 mb-2">
                  <span className="font-medium text-gray-700">Seller:</span> {postedByName} ({row.role})
                </div>
                {/* Sold Date */}
                <div className="text-xs text-gray-600 mb-3">
                  <span className="font-medium text-gray-700">Sold on:</span> {soldDate}
                </div>
                {/* Revenue Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                  <div className="text-xs text-green-700 font-medium">Revenue Generated</div>
                  <div className="text-sm font-bold text-green-800">₹{row.price.toLocaleString()}</div>
                </div>
              </div>
              {/* Gaming corner accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 