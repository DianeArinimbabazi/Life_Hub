import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import supabase from '../../supabaseClient';

const categoryColor = (cat) => {
  const colors = {
    Mindfulness: 'bg-purple-900 text-purple-300',
    Health: 'bg-green-900 text-green-300',
    Learning: 'bg-blue-900 text-blue-300',
    Fitness: 'bg-orange-900 text-orange-300',
    Career: 'bg-cyan-900 text-cyan-300',
    Personal: 'bg-pink-900 text-pink-300',
  };
  return colors[cat] || 'bg-gray-800 text-gray-400';
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Health', goal: 'Daily' });
  const isSaving = useRef(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: false });
    if (!error) setHabits(data);
    setLoading(false);
  };

  const saveHabit = async () => {
    if (!newHabit.name || isSaving.current) return;
    isSaving.current = true;
    const { data: { user } } = await supabase.auth.getUser();

    if (isEditing && newHabit.id) {
      const { error } = await supabase.from('habits').update({ 
        name: newHabit.name,
        category: newHabit.category,
        goal: newHabit.goal
      }).eq('id', newHabit.id);
      if (!error) {
        await fetchHabits();
        toast.success('Habit updated');
      } else {
        toast.error('Failed to update habit');
      }
    } else {
      const { error } = await supabase.from('habits').insert({ 
        ...newHabit, 
        user_id: user.id, 
        streak: 0, 
        strength: 0 
      });
      if (!error) {
        await fetchHabits();
        toast.success('New habit added');
      } else {
        toast.error('Failed to add habit');
      }
    }

    setShowModal(false);
    setIsEditing(false);
    setNewHabit({ name: '', category: 'Health', goal: 'Daily' });
    isSaving.current = false;
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit? All progress will be lost.')) return;
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (!error) {
      await fetchHabits();
      toast.success('Habit removed');
    } else {
      toast.error('Failed to remove habit');
    }
  };

  const openEditModal = (habit) => {
    setNewHabit(habit);
    setIsEditing(true);
    setShowModal(true);
  };

  const checkIn = async (habit) => {
    const newStreak = habit.streak + 1;
    const newStrength = Math.min(100, habit.strength + 5);
    const { error } = await supabase.from('habits').update({ streak: newStreak, strength: newStrength }).eq('id', habit.id);
    if (!error) {
      fetchHabits();
      toast.success('Momentum +1! 🔥', { icon: '🔥' });
    }
  };

  const topPerformer = habits.length > 0 ? [...habits].sort((a, b) => b.streak - a.streak)[0] : null;
  const weeklyConsistency = habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + h.strength, 0) / habits.length) : 0;

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex flex-col md:flex-row">
      <Sidebar />

      <div className="md:ml-56 flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">My Momentum</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Track your daily habits and build streaks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2">
              <input type="text" placeholder="Search habits..." className="bg-transparent text-white text-sm w-32 md:w-40 focus:outline-none placeholder-gray-600" />
            </div>
            <button onClick={() => { setIsEditing(false); setNewHabit({ name: '', category: 'Health', goal: 'Daily' }); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition whitespace-nowrap">
              + New Habit
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            {loading ? (
              <p className="text-gray-500 text-center mt-20">Loading habits...</p>
            ) : habits.length === 0 ? (
              <div className="text-center mt-20">
                <p className="text-gray-400 text-lg font-semibold">No habits yet</p>
                <p className="text-gray-600 text-sm mt-2">Click "+ New Habit" to start tracking</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {habits.map((habit) => (
                  <div key={habit.id} className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition group relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(habit.category)}`}>{habit.category}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => openEditModal(habit)} className="text-gray-500 hover:text-blue-400 text-xs" title="Edit habit">✎</button>
                        <button onClick={() => deleteHabit(habit.id)} className="text-gray-500 hover:text-red-400 text-xs" title="Delete habit">🗑</button>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{habit.name}</h3>
                    <p className="text-gray-500 text-xs mb-3">Goal: {habit.goal}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-orange-400 text-sm">🔥</span>
                      <span className="text-white font-bold text-lg">{habit.streak}</span>
                      <span className="text-gray-400 text-xs uppercase">Day Streak</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs uppercase">Strength</span>
                      <span className="text-gray-400 text-xs">{habit.strength}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${habit.strength}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Keep going!</span>
                      <button onClick={() => checkIn(habit)} className="text-blue-400 text-xs hover:text-blue-300 transition">
                        Check in →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Weekly Consistency</h3>
                  <p className="text-gray-500 text-xs">Average strength across all habits</p>
                </div>
                <span className="text-blue-400 font-bold text-xl">{weeklyConsistency}%</span>
              </div>
              <div className="flex items-end gap-3 h-32">
                {weekDays.map((day, i) => {
                  const height = [70, 90, 75, 85, 80, 60, 50][i];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg"
                        style={{ height: `${height}%`, background: i === 1 ? '#22d3ee' : '#3b82f6', opacity: i > 4 ? 0.5 : 1 }}
                      ></div>
                      <span className="text-gray-500 text-xs">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-64 space-y-4">
            {topPerformer && (
              <div className="bg-blue-900 border border-blue-700 rounded-2xl p-4">
                <p className="text-blue-300 text-xs font-semibold mb-1">Top Performer</p>
                <h3 className="text-white font-bold">{topPerformer.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-300 text-xs">Current Streak</span>
                  <span className="text-white font-bold text-sm">{topPerformer.streak} Days</span>
                </div>
              </div>
            )}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-500 text-xs font-semibold uppercase mb-3">Quick Stats</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total Habits</span>
                  <span className="text-white font-bold">{habits.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Best Streak</span>
                  <span className="text-white font-bold">{topPerformer ? topPerformer.streak : 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Avg Strength</span>
                  <span className="text-white font-bold">{weeklyConsistency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{isEditing ? 'Edit Habit' : 'New Habit'}</h2>
              <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="text-gray-500 hover:text-white">×</button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Habit name (e.g. Morning Meditation)"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option>Health</option>
                <option>Mindfulness</option>
                <option>Learning</option>
                <option>Fitness</option>
                <option>Career</option>
                <option>Personal</option>
              </select>
              <select
                value={newHabit.goal}
                onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option>Daily</option>
                <option>3x Weekly</option>
                <option>Weekly</option>
              </select>
              <button
                onClick={saveHabit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {isEditing ? 'Save Changes' : 'Add Habit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;
