import { useState, useEffect } from 'react';
import Card from '../components/Card';

export default function AllPostedIDs() {
  const [postedIDs, setPostedIDs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posted IDs for the logged-in user
  const fetchPostedIDs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/ids/get-my-posted', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch posted IDs');
      setPostedIDs(data); // assuming data is array of posted IDs
    } catch (err) {
      console.error('Error fetching posted IDs:', err.message);
      setPostedIDs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedIDs();
  }, []);

  if (loading) return <p>Loading posted IDs...</p>;

  if (postedIDs.length === 0) return <p>No posted IDs found.</p>;

  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-8 text-blue-700">All Posted IDs (Sub Admin)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {postedIDs.map((row) => (
          <Card key={row._id} className="p-4 sm:p-6 overflow-hidden flex flex-col h-full">
            <div className="relative bg-gray-100 flex items-center justify-center h-40 sm:h-48 mb-4 rounded-xl">
              {row.media?.[0]?.type === 'image' ? (
                <img src={`http://localhost:5000${row.media[0].url}`} alt="media" className="object-contain h-full w-full rounded-xl" />
              ) : null}
              {row.status === 'sold out' && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">SOLD</span>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="font-bold text-base sm:text-lg mb-1 text-blue-800">{row.title}</div>
              <div className="text-gray-500 text-xs sm:text-sm mb-2">ID: {row._id}</div>
              <div className="text-green-600 font-bold text-lg sm:text-xl mb-2">₹{row.price}</div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{row.role}</span>
                <span className="text-xs text-gray-500">by You</span>
              </div>
            </div>
            <div>
              <button
                className={`w-full py-2 rounded-full font-bold text-white transition text-sm sm:text-base ${
                  row.status === 'sold out' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105'
                }`}
                disabled={row.status === 'sold out'}
                onClick={() => {
                  if (row.status !== 'sold out' && row.telegramLink) {
                    window.open(row.telegramLink, '_blank');
                  }
                }}
              >
                {row.status === 'sold out' ? 'Sold Out' : 'Buy Now'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
