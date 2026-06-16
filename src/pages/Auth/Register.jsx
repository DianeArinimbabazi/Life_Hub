import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithProvider = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) return setError('Please fill in all fields.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!agreed) return setError('Please agree to the Terms of Service.');
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (signUpError) return setError(signUpError.message);
    navigate('/login');
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex flex-col items-center justify-center px-4">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-4">
        <div className="w-40"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl">Life Hub</span>
        </div>
        <div className="w-40 flex items-center justify-end gap-3">
          <span className="text-gray-400 text-sm">Already have an account?</span>
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition text-sm font-semibold">Log in</Link>
        </div>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md mt-16">
        <h2 className="text-2xl font-bold text-center mb-2">Create your account</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Get started with the most powerful productivity tool.</p>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={() => signInWithProvider('google')} className="flex items-center justify-center gap-2 border border-gray-700 rounded-lg py-3 text-sm text-gray-300 hover:border-gray-500 transition">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Google
          </button>
          <button onClick={() => signInWithProvider('github')} className="flex items-center justify-center gap-2 border border-gray-700 rounded-lg py-3 text-sm text-gray-300 hover:border-gray-500 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-gray-500 text-xs">OR CONTINUE WITH EMAIL</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white transition text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white transition text-sm"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition">Privacy Policy</Link>
            </label>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
          <p className="text-center text-gray-500 text-xs mt-2">
            By clicking "Create Account", you agree to join the Life Hub community. Manage your habits, master your time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;