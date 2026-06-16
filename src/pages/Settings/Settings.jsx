import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import supabase from '../../supabaseClient';

const tabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'password', label: 'Password & Security', icon: '🔒' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
];

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    habitReminders: true,
    taskDeadlines: true,
    weeklyReport: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return navigate('/login');
      setEmail(data.user.email || '');
      setName(data.user.user_metadata?.full_name || '');
    });
  }, [navigate]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const saveProfile = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email, data: { full_name: name } });
    setLoading(false);
    if (error) return showMessage(error.message, 'error');
    showMessage('Profile updated successfully.');
  };

  const savePassword = async () => {
    if (!newPassword || !confirmPassword) return showMessage('Please fill in all fields.', 'error');
    if (newPassword !== confirmPassword) return showMessage('Passwords do not match.', 'error');
    if (newPassword.length < 6) return showMessage('Password must be at least 6 characters.', 'error');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) return showMessage(error.message, 'error');
    setNewPassword('');
    setConfirmPassword('');
    showMessage('Password updated successfully.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    await supabase.auth.signOut();
    navigate('/');
  };

  const initial = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?';

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account, security and preferences</p>
        </div>

        <div className="flex gap-6">

          {/* Left Nav */}
          <div className="w-56 flex-shrink-0">

            {/* User Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{name || 'Your Name'}</p>
                <p className="text-gray-500 text-xs truncate">{email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden">
              {tabs.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition text-left
                    ${i !== tabs.length - 1 ? 'border-b border-gray-800' : ''}
                    ${activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : tab.id === 'danger'
                        ? 'text-red-400 hover:bg-gray-800'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-800 px-4 py-2.5 rounded-xl text-sm transition"
            >
              <span>⇤</span> Log Out
            </button>
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0">

            {/* Message */}
            {message.text && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-900 border border-red-700 text-red-300' : 'bg-green-900 border border-green-700 text-green-300'}`}>
                {message.text}
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-white font-semibold mb-1">Public Profile</h2>
                  <p className="text-gray-500 text-xs mb-6">This information will be displayed across your Life Hub workspace.</p>

                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-800">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                      {initial}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{name || 'Your Name'}</p>
                      <p className="text-gray-400 text-sm">{email}</p>
                      <span className="inline-block mt-1 text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Pro Plan</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Password */}
            {activeTab === 'password' && (
              <div className="space-y-4">
                <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-white font-semibold mb-1">Password & Security</h2>
                  <p className="text-gray-500 text-xs mb-6">Update your password to keep your account secure.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-1">Connected Accounts</h3>
                  <p className="text-gray-500 text-xs mb-4">Manage your OAuth providers.</p>
                  <div className="space-y-3">
                    {[
                      { name: 'GitHub', icon: '🐙', connected: true },
                      { name: 'Google', icon: '🔵', connected: false },
                    ].map((provider) => (
                      <div key={provider.name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{provider.icon}</span>
                          <span className="text-white text-sm font-medium">{provider.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${provider.connected ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                          {provider.connected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={savePassword}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-1">Notification Preferences</h2>
                <p className="text-gray-500 text-xs mb-6">Choose what you want to be notified about.</p>
                <div className="space-y-0">
                  {[
                    { key: 'emailDigest', label: 'Daily Email Digest', desc: 'A morning summary of your tasks and habits', icon: '📧' },
                    { key: 'habitReminders', label: 'Habit Reminders', desc: 'Reminders for habits you have not completed', icon: '🔁' },
                    { key: 'taskDeadlines', label: 'Task Deadlines', desc: 'Alerts before your tasks are due', icon: '📅' },
                    { key: 'weeklyReport', label: 'Weekly Performance Report', desc: 'A detailed report every Sunday', icon: '📊' },
                  ].map(({ key, label, desc, icon }, i, arr) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between py-4 ${i !== arr.length - 1 ? 'border-b border-gray-800' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0d1117] rounded-lg flex items-center justify-center text-lg">
                          {icon}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{label}</p>
                          <p className="text-gray-500 text-xs">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifications[key] ? 'bg-blue-600' : 'bg-gray-700'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[key] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-1">Appearance</h2>
                <p className="text-gray-500 text-xs mb-6">Customize how Life Hub looks for you.</p>
                <div>
                  <label className="text-gray-400 text-xs uppercase font-semibold mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Dark', bg: '#0d1117', active: true },
                      { label: 'Darker', bg: '#090d12', active: false },
                      { label: 'Midnight', bg: '#06080d', active: false },
                    ].map((theme) => (
                      <button
                        key={theme.label}
                        className={`rounded-xl p-4 border-2 transition text-sm font-medium ${theme.active ? 'border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                        style={{ background: theme.bg }}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-6">More appearance options coming soon.</p>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === 'danger' && (
              <div className="space-y-4">
                <div className="bg-[#161b22] border border-red-900 rounded-2xl p-6">
                  <h2 className="text-red-400 font-semibold mb-1">Danger Zone</h2>
                  <p className="text-gray-500 text-xs mb-6">These actions are permanent and cannot be undone.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-xl border border-gray-800">
                      <div>
                        <p className="text-white text-sm font-semibold">Export My Data</p>
                        <p className="text-gray-500 text-xs mt-0.5">Download all your tasks, habits and journal entries</p>
                      </div>
                      <button className="border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg text-sm transition">
                        Export
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-xl border border-red-900">
                      <div>
                        <p className="text-white text-sm font-semibold">Delete Account</p>
                        <p className="text-gray-500 text-xs mt-0.5">Permanently delete your account and all associated data</p>
                      </div>
                      <button
                        onClick={deleteAccount}
                        className="bg-red-900 hover:bg-red-800 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
