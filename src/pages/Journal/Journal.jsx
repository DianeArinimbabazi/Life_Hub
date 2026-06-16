import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const initialEntries = [
  { id: 1, date: 'June 16, 2024', tag: 'Focus', title: 'Overcoming Procrastination', preview: 'Today was tough but I managed to stick to deep focus blocks and got a lot done...', content: 'Today was tough but I managed to stick to deep focus blocks and got a lot done. I realized that starting small is the key to beating procrastination. Instead of thinking about the whole task, I just focused on the first 5 minutes.' },
  { id: 2, date: 'June 15, 2024', tag: 'Grateful', title: 'The Power of Habits', preview: 'I noticed that doing yoga first thing in the morning completely shifts my energy...', content: 'I noticed that doing yoga first thing in the morning completely shifts my energy for the rest of the day. Grateful for the consistency I have built over the past month. Small daily actions compound into big results.' },
  { id: 3, date: 'June 14, 2024', tag: 'Reflection', title: 'Weekly Review', preview: 'Reviewed my goals for the week. Hit 4 out of 5 targets which feels great...', content: 'Reviewed my goals for the week. Hit 4 out of 5 targets which feels great. The one I missed was the reading goal — I need to schedule it earlier in the day before I get tired.' },
  { id: 4, date: 'June 13, 2024', tag: 'Motivation', title: 'Finding My Why', preview: 'Spent time thinking about why I am building these habits and what truly matters...', content: 'Spent time thinking about why I am building these habits and what truly matters to me. My core motivation is to become the best version of myself so I can show up fully for the people I care about.' },
];

const tagColor = (tag) => {
  const colors = {
    Focus: 'bg-blue-900 text-blue-300',
    Grateful: 'bg-green-900 text-green-300',
    Reflection: 'bg-purple-900 text-purple-300',
    Motivation: 'bg-orange-900 text-orange-300',
  };
  return colors[tag] || 'bg-gray-800 text-gray-400';
};

function Journal() {
  const [entries, setEntries] = useState(initialEntries);
  const [selected, setSelected] = useState(initialEntries[0]);
  const [search, setSearch] = useState('');
  const [writing, setWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Focus');

  const filtered = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  const saveEntry = () => {
    if (!newTitle || !newContent) return;
    const entry = {
      id: entries.length + 1,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      tag: newTag,
      title: newTitle,
      preview: newContent.slice(0, 80) + '...',
      content: newContent,
    };
    setEntries([entry, ...entries]);
    setSelected(entry);
    setWriting(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex">
      <Sidebar />

      <div className="ml-56 flex-1 flex">

        {/* Left - Entry List */}
        <div className="w-72 border-r border-gray-800 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Journal</h1>
            <button
              onClick={() => setWriting(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              + New Entry
            </button>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2 mb-4">
            <input
              type="text"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white text-sm w-full focus:outline-none placeholder-gray-600"
            />
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                onClick={() => { setSelected(entry); setWriting(false); }}
                className={`p-3 rounded-xl border cursor-pointer transition ${selected?.id === entry.id && !writing ? 'border-blue-600 bg-[#161b22]' : 'border-gray-800 bg-[#161b22] hover:border-gray-600'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-500 text-xs">{entry.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tagColor(entry.tag)}`}>{entry.tag}</span>
                </div>
                <h3 className="text-white text-sm font-semibold mb-1">{entry.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{entry.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Entry View or New Entry */}
        <div className="flex-1 p-8">
          {writing ? (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">New Journal Entry</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Entry title..."
                    className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Tag</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option>Focus</option>
                    <option>Grateful</option>
                    <option>Reflection</option>
                    <option>Motivation</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Content</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    rows={10}
                    className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={saveEntry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Save Entry
                  </button>
                  <button
                    onClick={() => setWriting(false)}
                    className="border border-gray-700 text-gray-400 px-6 py-3 rounded-lg hover:border-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : selected ? (
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-500 text-sm">{selected.date}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${tagColor(selected.tag)}`}>{selected.tag}</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">{selected.title}</h2>
              <p className="text-gray-300 leading-relaxed text-base">{selected.content}</p>
              <button
                onClick={() => setWriting(true)}
                className="mt-8 border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-gray-500 transition"
              >
                + New Entry
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select an entry or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Journal;