import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import Card from '../components/Card';

export default function SubAdminActivity() {
  const [subadmins, setSubadmins] = useState([]);
  const [postedIDs, setPostedIDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetch('http://localhost:5000/api/subadmin/get-all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
      fetch('http://localhost:5000/api/ids').then(res => res.json()),
    ])
      .then(([subadminsRes, postedIDsRes]) => {
        setSubadmins(Array.isArray(subadminsRes) ? subadminsRes : []);
        setPostedIDs(Array.isArray(postedIDsRes) ? postedIDsRes : []);
      })
      .catch(() => setError('Failed to fetch data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-blue-600 text-center py-12 font-bold animate-pulse">Loading subadmin activity...</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center py-12 font-bold">{error}</div>;
  }

  // Group posted IDs by subadmin
  const subadminCards = subadmins.map((sub) => {
    const games = postedIDs.filter(
      (id) => id.role === 'SubAdmin' && id.postedBy === sub._id
    );
    return (
      <Card
        key={sub._id}
        header={
          <span className="text-blue-600 font-bold text-lg ml-4">
            {sub.username || sub.name}{' '}
            <span className="text-xs text-gray-500 font-normal">({sub.email})</span>
          </span>
        }
        className="bg-white border border-gray-200 mb-8"
      >
        <Table className='m-4'
          columns={[
            // { label: 'ID', accessor: '_id' },
            { label: 'Title', accessor: 'title' },
            {
              label: 'Media',
              accessor: 'media',
              render: (row) => (
                <div className="flex gap-2">
                  {Array.isArray(row.media) && row.media.map((m, i) =>
                    m.type === 'image' ? (
                      <img
                        key={i}
                        src={m.url.startsWith('http') ? m.url : `http://localhost:5000${m.url}`}
                        alt="media"
                        className="w-12 h-12 rounded-lg object-cover border-2 border-gray-300 shadow hover:border-blue-400 transition-colors"
                      />
                    ) : (
                      <video
                        key={i}
                        src={m.url.startsWith('http') ? m.url : `http://localhost:5000${m.url}`}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow"
                        controls
                      />
                    )
                  )}
                </div>
              ),
            },
            {
              label: 'Price',
              accessor: 'price',
              render: (row) => <span className="text-green-600 font-bold">₹{row.price}</span>,
            },
            {
              label: 'Status',
              accessor: 'status',
              render: (row) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 ${
                    row.status === 'sold' || row.status === 'sold out'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-green-100 text-green-700 border-green-300'
                  }`}
                >
                  {row.status === 'sold' || row.status === 'sold out' ? 'Sold' : 'Available'}
                </span>
              ),
            },
          ]}
          data={games}
        />
        {games.length === 0 && (
          <div className="text-gray-500 text-center py-4">No posted IDs for this subadmin.</div>
        )}
      </Card>
    );
  });

  return <div className="space-y-8">{subadminCards}</div>;
} 