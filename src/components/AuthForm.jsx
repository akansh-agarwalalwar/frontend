import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility to check for suspicious input (NoSQL/SQL injection patterns)
function isInputSafe(str) {
  if (!str) return true;
  // Disallow MongoDB/SQL special chars and operators
  const blacklist = /[${}<>;\[\]'"|&]/;
  if (blacklist.test(str)) return false;
  // Disallow leading $ (MongoDB operator)
  if (str.trim().startsWith('$')) return false;
  return true;
}

export default function AuthForm({ role }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Client-side input validation
    if (!isInputSafe(username) || !isInputSafe(password)) {
      setError('Invalid input detected.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setTimeout(() => {
        if (data.role === 'admin') navigate('/admin');
        else if (data.role === 'subadmin') navigate('/subadmin');
        else navigate('/');
      }, 200);
    } catch (err) {
      setError('Login failed');
    }
  };

  // Password reset handlers
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');
    setError('');
    if (!isInputSafe(resetEmail)) {
      setError('Invalid input detected.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/${role}/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to send OTP');
      setResetStep(2);
      setResetMessage('OTP sent to your email.');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');
    setError('');
    if (!isInputSafe(resetOtp)) {
      setError('Invalid input detected.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/${role}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim(), otp: resetOtp.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error('OTP verification failed');
      setResetStep(3);
      setResetMessage('OTP verified. Please enter your new password.');
    } catch (err) {
      setError('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');
    setError('');
    if (!isInputSafe(resetNewPassword)) {
      setError('Invalid input detected.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/${role}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim(), otp: resetOtp.trim(), newPassword: resetNewPassword.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Password reset failed');
      setResetMessage('Password reset successful! You can now log in.');
      setShowReset(false);
      setResetStep(1);
      setResetEmail('');
      setResetOtp('');
      setResetNewPassword('');
    } catch (err) {
      setError('Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">{role === 'admin' ? 'Admin' : 'Subadmin'} Login</h2>
        {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none transition"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none transition"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition text-lg"
        >
          Login
        </button>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm mt-2"
          onClick={() => { setShowReset(true); setError(''); setResetMessage(''); }}
        >
          Forgot password?
        </button>
      </form>
      {/* Password Reset Modal/Inline */}
      {showReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => { setShowReset(false); setResetStep(1); setResetEmail(''); setResetOtp(''); setResetNewPassword(''); setError(''); setResetMessage(''); }}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-blue-700 mb-2">Reset Password</h3>
            {resetStep === 1 && (
              <form onSubmit={handleResetRequest} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border rounded px-4 py-2 w-full"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded font-semibold mt-2"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}
            {resetStep === 2 && (
              <form onSubmit={handleOtpVerify} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border rounded px-4 py-2 w-full"
                  value={resetOtp}
                  onChange={e => setResetOtp(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded font-semibold mt-2"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
            {resetStep === 3 && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="New password"
                  className="border rounded px-4 py-2 w-full"
                  value={resetNewPassword}
                  onChange={e => setResetNewPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded font-semibold mt-2"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
            {resetMessage && <div className="text-green-600 text-center mt-2">{resetMessage}</div>}
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 

