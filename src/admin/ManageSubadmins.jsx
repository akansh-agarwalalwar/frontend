
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import SubAdminForm from '../components/SubAdminForm';

export default function ManageSubadmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch subadmins from backend
  const fetchSubAdmins = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/subadmin/get-all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch subadmins');
      setSubAdmins(data);
    } catch (err) {
      console.error('Error fetching subadmins:', err.message);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  // Delete subadmin by id
  const deleteSubAdmin = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/subadmin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete subadmin');

      // Remove deleted subadmin from the state (immediate UI update)
      setSubAdmins((prev) => prev.filter((sa) => sa._id !== id));
    } catch (err) {
      console.error('Delete failed:', err.message);
      alert('Failed to delete subadmin: ' + err.message);
    }
  };

  const handleSubAdminAdded = async () => {
    setShowModal(false);
    await fetchSubAdmins(); // Refresh list after adding
  };

  return (
    <Card header="Manage Sub Admins" className="max-w-3xl mx-auto mb-8 shadow-lg p-10">
      <div className="flex justify-end mb-4">
        <button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition text-base sm:text-lg"
          onClick={() => setShowModal(true)}
        >
          Add Subadmin
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg bg-white shadow text-sm sm:text-base">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2 sm:p-3 text-left">Username</th>
              <th className="p-2 sm:p-3 text-left">Email</th>
              <th className="p-2 sm:p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subAdmins.map((sa) => (
              <tr key={sa._id} className="border-t hover:bg-blue-50 transition">
                <td className="p-2 sm:p-3">{sa.username}</td>
                <td className="p-2 sm:p-3">{sa.email}</td>
                <td className="p-2 sm:p-3 flex flex-col sm:flex-row gap-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold w-full sm:w-auto"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${sa.username}?`)) {
                        deleteSubAdmin(sa._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add Subadmin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-200 p-0 w-full max-w-lg mx-2 relative animate-scale-in">
            <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-blue-100 rounded-t-3xl">
              <h2 className="text-2xl font-extrabold text-blue-700">Add Subadmin</h2>
              <button
                className="text-3xl text-gray-400 hover:text-red-500 focus:outline-none font-bold transition"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-6">
              <SubAdminForm onSuccess={handleSubAdminAdded} onClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}