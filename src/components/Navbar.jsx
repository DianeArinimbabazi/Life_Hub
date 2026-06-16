import React from 'react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0d1117] border-b border-gray-800">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">⚡</div>
          <span className="text-white font-bold text-xl">Life Hub</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
          <a href="#process" className="text-gray-400 hover:text-white transition">Process</a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href="/login" className="text-white hover:text-blue-400 transition">Login</a>
        <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Get Started</a>
      </div>
    </nav>
  );
}

export default Navbar;