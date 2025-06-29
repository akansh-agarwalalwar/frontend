
import React, { useState } from 'react';

export default function SubAdminForm({ onSuccess, onClose }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      // console.log(token)
      const res = await fetch('https://swarg-store-backend.onrender.com/api/subadmin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create subadmin');
      setSuccess('Subadmin created successfully!');
      setForm({ username: '', email: '', password: '' });
      if (onSuccess) onSuccess();
      if (onClose) setTimeout(onClose, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="border rounded px-3 py-2"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border rounded px-3 py-2"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border rounded px-3 py-2"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Subadmin'}
      </button>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {success && <div className="text-green-600 text-center">{success}</div>}
    </form>
  );
} 