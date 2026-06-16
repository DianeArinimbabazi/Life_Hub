import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-gray-800 py-16 px-8 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">⚡</div>
            <span className="text-white font-bold text-xl">Life Hub</span>
          </div>
          <p className="text-gray-400 text-sm">The modern productivity platform for those who demand more from their time and potential.</p>
          <div className="flex gap-4 mt-4 text-gray-400">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Integrations', 'Habit Loops', 'Changelog'] },
          { title: 'Resources', links: ['Documentation', 'Productivity Blog', 'Community', 'Help Center'] },
          { title: 'Company', links: ['About Us', 'Privacy Policy', 'Terms of Service', 'Security'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}><a href="#" className="text-gray-400 hover:text-white transition text-sm">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between text-gray-500 text-sm">
        <p>© 2024 Life Hub Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">Support</a>
          <a href="#" className="hover:text-white transition">System Status</a>
          <a href="#" className="hover:text-white transition">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;