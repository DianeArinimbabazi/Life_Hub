import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
  const navigate = useNavigate();
  const tasks = [
    { title: 'Review quarterly goals', priority: 'High', done: true },
    { title: 'Prepare for team sync', priority: 'Medium', done: false },
    { title: 'Update project roadmap', priority: 'High', done: false },
    { title: 'Workout - Upper Body', priority: 'Medium', done: false },
    { title: 'Email potential partners', priority: 'Low', done: false },
  ];

  const habits = [
    { name: 'Reading (30m)', days: [1,1,1,1,0,0,0] },
    { name: 'Morning Yoga', days: [1,1,1,1,1,0,0] },
    { name: 'No Sugar', days: [1,1,1,0,0,0,0] },
    { name: 'Coding Practice', days: [1,1,1,1,0,0,0] },
    { name: 'Meditation', days: [1,1,1,1,1,0,0] },
    { name: 'Walk 10k steps', days: [1,1,1,0,0,0,0] },
  ];

  const journals = [
    { date: 'YESTERDAY', tag: 'Focus', title: 'Overcoming Procrastination', preview: 'Today was tough but I managed to stick to deep focus blocks...' },
    { date: 'MAY 20', tag: 'Grateful', title: 'The Power of Habits', preview: 'I noticed that doing yoga first thing in the morning completely shifts my energy...' },
  ];

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-56 flex-1 p-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 w-80">
            <span className="text-gray-500 text-sm">Search tasks, habits, insights...</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Current Streak: 12 Days 🔥</span>
            <button onClick={() => navigate('/tasks')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              + Add New
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Good Morning, Alex 👋</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-gray-400 text-sm">Monday, May 22, 2024</span>
            <span className="text-blue-400 text-sm italic">"Focus on progress, not perfection."</span>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">

          {/* Today's Tasks */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Today's Tasks</h3>
                <p className="text-gray-500 text-xs">4 tasks remaining</p>
              </div>
              <button onClick={() => navigate('/tasks')} className="text-blue-400 text-xs hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${task.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600'}`}>
                    {task.done && '✓'}
                  </div>
                  <span className={`text-sm flex-1 ${task.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-red-900 text-red-300' :
                    task.priority === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-800 text-gray-400'
                  }`}>{task.priority}</span>
                </div>
              ))}
            </div>
            <p className="text-green-400 text-xs mt-4">You're 20% more productive today than yesterday!</p>
          </div>

          {/* Habits Progress */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold">Habits Progress</h3>
              <span className="text-gray-500 text-xs">M T W T F S S</span>
            </div>
            <p className="text-gray-500 text-xs mb-4">Week 21 • May 22-28</p>
            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.name} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm w-32">{habit.name}</span>
                  <div className="flex gap-1">
                    {habit.days.map((done, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full ${done ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>OVERALL SUCCESS RATE</span>
                <span className="text-blue-400">82%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '82%'}}></div>
              </div>
            </div>
          </div>

          {/* Daily Performance */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Daily Performance</h3>
            <p className="text-gray-500 text-xs mb-4">Efficiency & Stats</p>
            <div className="flex items-center justify-center my-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10"
                    strokeDasharray="251.2" strokeDashoffset="62.8"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">75%</span>
                  <span className="text-gray-500 text-xs">EFFICIENCY</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-center">
                <p className="text-gray-500 text-xs">FOCUS</p>
                <p className="text-white font-bold text-lg">4.2h</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">RATE</p>
                <p className="text-white font-bold text-lg">12/15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">

          {/* Recent Journal */}
          <div className="col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Recent Journal</h3>
                <p className="text-gray-500 text-xs">Daily reflections and thoughts</p>
              </div>
              <button onClick={() => navigate('/journal')} className="text-blue-400 text-xs hover:text-blue-300">New Entry</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {journals.map((j) => (
                <div key={j.title} className="bg-[#0d1117] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs">{j.date}</span>
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{j.tag}</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{j.title}</h4>
                  <p className="text-gray-400 text-xs">{j.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Quick Actions</h3>
            <p className="text-gray-500 text-xs mb-4">One-tap logging</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'WATER' },
                { label: 'TIMER' },
                { label: 'NOTE' },
                { label: 'ENERGY' },
              ].map((action) => (
                <button key={action.label} className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-blue-700 transition">
                  <div className="w-8 h-8 bg-blue-900 rounded-lg"></div>
                  <span className="text-gray-400 text-xs">{action.label}</span>
                </button>
              ))}
            </div>
            <button className="text-blue-400 text-xs mt-4 w-full text-center hover:text-blue-300">Customize Actions</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;