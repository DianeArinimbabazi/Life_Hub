import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const initialHabits = [
  { id: 1, name: 'Morning Meditation', category: 'Mindfulness', goal: 'Daily', streak: 12, strength: 92, days: [1,1,1,1,1,1,0], last: 'Today, 7:30 AM' },
  { id: 2, name: 'Hydration (2L)', category: 'Health', goal: 'Daily', streak: 5, strength: 75, days: [1,1,1,1,1,0,0], last: 'Today, 2:15 PM' },
  { id: 3, name: 'Evening Reading', category: 'Learning', goal: 'Daily', streak: 24, strength: 100, days: [1,1,1,1,1,1,1], last: 'Yesterday' },
  { id: 4, name: 'Strength Training', category: 'Fitness', goal: '3x Weekly', streak: 3, strength: 88, days: [1,0,1,0,1,0,0], last: 'Yesterday' },
  { id: 5, name: 'Code Practice', category: 'Career', goal: 'Daily', streak: 8, strength: 95, days: [1,1,1,1,1,0,0], last: 'Today, 10:00 AM' },
  { id: 6, name: 'Journaling', category: 'Personal', goal: 'Daily', streak: 0, strength: 40, days: [1,0,0,1,0,0,0], last: '3 days ago' },
];

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
  const [habits, setHabits] = useState(initialHabits);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Health', goal: 'Daily' });

  const addHabit = () => {
    if (!newHabit.name) return;
    const habit = { ...newHabit, id: Date.now(), streak: 0, strength: 0, days: [0,0,0,0,0,0,0], last: 'Never' };
    setHabits([...habits, habit]);
    setShowModal(false);
    setNewHabit({ name: '', category: 'Health', goal: 'Daily' });
  };

  const checkIn = (id) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const newDays = [...h.days];
        newDays[0] = newDays[0] ? 0 : 1;
        return { ...h, days: newDays, streak: newDays[0] ? h.streak + 1 : h.streak - 1 };
      }
      return h;
    }));
  };

  const topPerformer = [...habits].sort((a, b) => b.streak - a.streak)[0];
  const weeklyConsistency = Math.round(habits.reduce((acc, h) => acc + h.strength, 0) / habits.length);

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex">
      <Sidebar />

      <div className="ml-56 flex-1 p-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Momentum</h1>
            <p className="text-gray-400 text-sm mt-1">You are on a 12-day meditation streak. Keep it going!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2">
              <input
                type="text"
                placeholder="Search habits..."
                className="bg-transparent text-white text-sm w-40 focus:outline-none placeholder-gray-600"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              + New Habit
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex gap-6">

          {/* Habits Cards + Chart */}
          <div className="flex-1">

            {/* Habit Cards Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {habits.map((habit) => (
                <div key={habit.id} className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(habit.category)}`}>{habit.category}</span>
                    <button className="text-gray-600 hover:text-gray-400 text-lg">⋯</button>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{habit.name}</h3>
                  <p className="text-gray-500 text-xs mb-3">Goal: {habit.goal}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-400 text-sm">🔥</span>
                    <span className="text-white font-bold text-lg">{habit.streak}</span>
                    <span className="text-gray-400 text-xs uppercase">Day Streak</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs uppercase">7-Day Progress</span>
                    <span className="text-gray-400 text-xs">{habit.strength}% Strength</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {habit.days.map((done, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full ${done ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Last: {habit.last}</span>
                    <button
                      onClick={() => checkIn(habit.id)}
                      className="text-blue-400 text-xs hover:text-blue-300 transition"
                    >
                      Check in →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Consistency Chart */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Weekly Consistency</h3>
                  <p className="text-gray-500 text-xs">Average completion rate across all habits</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold text-xl">{weeklyConsistency}%</span>
                  <span className="text-green-400 text-sm">+4%</span>
                </div>
              </div>
              <div className="flex items-end gap-3 h-32">
                {weekDays.map((day, i) => {
                  const height = [70, 90, 75, 85, 80, 60, 50][i];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg"
                        style={{
                          height: `${height}%`,
                          background: i === 1 ? '#22d3ee' : '#3b82f6',
                          opacity: i > 4 ? 0.5 : 1
                        }}
                      ></div>
                      <span className="text-gray-500 text-xs">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-56 space-y-4">

            {/* Top Performer */}
            <div className="bg-blue-900 border border-blue-700 rounded-2xl p-4">
              <div className="w-8 h-8 bg-blue-700 rounded-lg mb-3"></div>
              <p className="text-blue-300 text-xs font-semibold mb-1">Top Performer</p>
              <h3 className="text-white font-bold">{topPerformer.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-blue-300 text-xs">Current Streak</span>
                <span className="text-white font-bold text-sm">{topPerformer.streak} Days</span>
              </div>
            </div>

            {/* Upcoming Focus */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-500 text-xs font-semibold uppercase mb-3">Upcoming Focus</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Hydration Check</p>
                    <p className="text-gray-500 text-xs">Next reminder: 3:30 PM</p>
                  </div>
                  <div className="w-5 h-5 border-2 border-gray-600 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Strength Training</p>
                    <p className="text-gray-500 text-xs">Schedule: 5:00 PM</p>
                  </div>
                  <div className="w-5 h-5 border-2 border-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">New Habit</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl">×</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Habit Name</label>
                  <input type="text" value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} placeholder="e.g. Morning Run" className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm transition" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Category</label>
                  <select value={newHabit.category} onChange={e => setNewHabit({...newHabit, category: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm transition">
                    <option>Health</option>
                    <option>Mindfulness</option>
                    <option>Learning</option>
                    <option>Fitness</option>
                    <option>Career</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Goal</label>
                  <select value={newHabit.goal} onChange={e => setNewHabit({...newHabit, goal: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm transition">
                    <option>Daily</option>
                    <option>3x Weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={addHabit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition">Add Habit</button>
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-700 text-gray-400 hover:border-gray-500 py-2.5 rounded-lg text-sm transition">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;