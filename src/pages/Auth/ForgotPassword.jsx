import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex flex-col items-center justify-center px-4">

      {/* Main Card */}
      <div className="w-full max-w-md text-center">

        {/* Logo Circle */}
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 bg-blue-400 rounded-md"></div>
        </div>

        <h2 className="text-2xl font-bold mb-3">Forgot password?</h2>
        <p className="text-gray-400 text-sm mb-8">
          Enter the email address associated with your account<br />
          and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="bg-[#161b22] border border-green-700 rounded-2xl p-6 text-center">
            <p className="text-green-400 font-semibold">Reset link sent!</p>
            <p className="text-gray-400 text-sm mt-2">Check your email inbox and follow the instructions.</p>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Send reset link
            </button>
          </div>
        )}

        {/* Bottom Card */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 mt-6 space-y-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            ← Back to Login
          </Link>
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex gap-6 mt-12 text-gray-600 text-xs">
        <Link to="/privacy" className="hover:text-gray-400 transition">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-gray-400 transition">Terms of Service</Link>
        <Link to="/help" className="hover:text-gray-400 transition">Help Center</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;