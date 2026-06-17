import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import supabase from '../../supabaseClient';

const tagColor = (tag) => {
  const colors = {
    Focus: 'bg-blue-900 text-blue-300',
    Grateful: 'bg-green-900 text-green-300',
    Reflection: 'bg-purple-900 text-purple-300',
    Motivation: 'bg-orange-900 text-orange-300',
  };
  return colors[tag] || 'bg-gray-800 text-gray-400';
};

const moods = [
  { score: 2, emoji: '😫', label: 'Stressed' },
  { score: 4, emoji: '😕', label: 'Average' },
  { score: 6, emoji: '🙂', label: 'Good' },
  { score: 8, emoji: '🤩', label: 'Great' },
  { score: 10, emoji: '🔥', label: 'Unstoppable' },
];

function Journal() {
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Focus');
  const [newMood, setNewMood] = useState(6);
  const isSaving = useRef(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false });
    if (!error) setEntries(data);
    setLoading(false);
  };

  const saveEntry = async () => {
    if (!newTitle || !newContent || isSaving.current) return;
    isSaving.current = true;
    const { data: { user } } = await supabase.auth.getUser();

    const entryData = {
      title: newTitle,
      content: newContent,
      tag: newTag,
      mood_score: newMood,
    };

    if (isEditing && selected?.id) {
      const { error } = await supabase.from('journal_entries').update(entryData).eq('id', selected.id);
      
      if (!error) {
        await fetchEntries();
        setSelected({ ...selected, ...entryData });
        setWriting(false);
        setIsEditing(false);
        toast.success('Entry updated');
      } else {
        toast.error('Failed to update entry. Check your table schema.');
      }
    } else {
      const { data, error } = await supabase.from('journal_entries').insert({
        ...entryData,
        user_id: user.id,
      }).select().single();
      
      if (!error) {
        await fetchEntries();
        setSelected(data);
        setWriting(false);
        toast.success('Reflection saved');
      } else {
        toast.error('Failed to save entry. Check your table schema.');
      }
    }

    setNewTitle('');
    setNewContent('');
    setNewTag('Focus');
    setNewMood(6);
    isSaving.current = false;
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) return;
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (!error) {
      await fetchEntries();
      setSelected(null);
      toast.success('Entry deleted');
    } else {
      toast.error('Failed to delete entry');
    }
  };

  const startEditing = () => {
    setNewTitle(selected.title);
    setNewContent(selected.content);
    setNewTag(selected.tag);
    setNewMood(selected.mood_score || 6);
    setIsEditing(true);
    setWriting(true);
  };

  const filtered = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getMoodEmoji = (score) => moods.find(m => m.score === score)?.emoji || '🙂';

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex flex-col md:flex-row">
      <Sidebar />

      <div className="md:ml-56 flex-1 flex flex-col lg:flex-row min-h-screen">

        {/* Left - Entry List */}
        <div className="w-full lg:w-72 border-r border-gray-800 p-4 flex flex-col pt-16 md:pt-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Journal</h1>
            <button
              onClick={() => { setWriting(true); setIsEditing(false); setSelected(null); setNewTitle(''); setNewContent(''); setNewTag('Focus'); setNewMood(6); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition"
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

          {loading ? (
            <p className="text-gray-500 text-sm text-center mt-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-600 text-sm text-center mt-8">No entries yet</p>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1">
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => { setSelected(entry); setWriting(false); setIsEditing(false); }}
                  className={`p-3 rounded-xl border cursor-pointer transition ${selected?.id === entry.id && !writing ? 'border-blue-600 bg-[#161b22]' : 'border-gray-800 bg-[#161b22] hover:border-gray-600'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 text-[10px]">{formatDate(entry.created_at)}</span>
                    <span className="text-sm">{getMoodEmoji(entry.mood_score)}</span>
                  </div>
                  <h3 className="text-white text-sm font-semibold mb-1">{entry.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{entry.content?.slice(0, 80)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Entry View or New Entry */}
        <div className="flex-1 p-4 md:p-8 border-t lg:border-t-0 border-gray-800 overflow-y-auto">
          {writing ? (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Entry' : 'New Journal Entry'}</h2>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
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
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-3 block">How are you feeling today?</label>
                  <div className="flex gap-2">
                    {moods.map((m) => (
                      <button
                        key={m.score}
                        onClick={() => setNewMood(m.score)}
                        className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition ${newMood === m.score ? 'bg-blue-600 border-blue-600' : 'bg-[#161b22] border-gray-700 hover:border-gray-500'}`}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-[10px] text-gray-300">{m.label}</span>
                      </button>
                    ))}
                  </div>
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
                    {isEditing ? 'Save Changes' : 'Save Entry'}
                  </button>
                  <button
                    onClick={() => { setWriting(false); setIsEditing(false); }}
                    className="border border-gray-700 text-gray-400 px-6 py-3 rounded-lg hover:border-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : selected ? (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">{formatDate(selected.created_at)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tagColor(selected.tag)}`}>{selected.tag}</span>
                  {selected.mood_score && (
                    <span className="text-lg" title="Today's Mood">{getMoodEmoji(selected.mood_score)}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={startEditing}
                    className="text-gray-400 hover:text-blue-400 text-sm flex items-center gap-1 transition"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => deleteEntry(selected.id)}
                    className="text-gray-400 hover:text-red-400 text-sm flex items-center gap-1 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-6">{selected.title}</h2>
              <p className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap">{selected.content}</p>
              <button
                onClick={() => { setWriting(true); setIsEditing(false); setSelected(null); setNewTitle(''); setNewContent(''); setNewTag('Focus'); setNewMood(6); }}
                className="mt-8 border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-gray-500 transition"
              >
                + New Entry
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-400 text-lg font-semibold">Your journal awaits</p>
              <p className="text-gray-600 text-sm mt-2">Select an entry or create a new one</p>
              <button
                onClick={() => setWriting(true)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                + Write First Entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Journal;
