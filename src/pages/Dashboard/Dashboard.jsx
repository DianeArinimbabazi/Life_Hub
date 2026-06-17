import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import supabase from '../../supabaseClient';

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [journals, setJournals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    if (currentUser) {
      // Fetch Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch Habits
      const { data: habitData } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch Journal Entries
      const { data: journalData } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (taskData) setTasks(taskData);
      if (habitData) setHabits(habitData);
      if (journalData) setJournals(journalData);
    }
    setLoading(false);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const remainingTasksCount = tasks.filter(t => !t.done).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-[#0d1117] min-h-screen text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex flex-col md:flex-row">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 md:ml-56 w-full max-w-7xl mx-auto">

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-12 md:pt-0">
          <div className="hidden md:flex items-center gap-3 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 w-full md:w-80">
            <span className="text-gray-500 text-sm">Search tasks, habits...</span>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className="text-gray-400 text-xs md:text-sm">Best Streak: {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0} Days 🔥</span>
            <button onClick={() => navigate('/tasks')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition">
              + New Task
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">Good Morning, {displayName} 👋</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1 text-center md:text-left">
            <span className="text-gray-400 text-xs md:text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <span className="text-blue-400 text-xs md:text-sm italic">"Focus on progress, not perfection."</span>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

          {/* Today's Tasks */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Recent Tasks</h3>
                <p className="text-gray-500 text-xs">{remainingTasksCount} tasks remaining</p>
              </div>
              <button onClick={() => navigate('/tasks')} className="text-blue-400 text-xs hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-3">
              {tasks.length > 0 ? tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${task.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600'}`}>
                    {task.done && '✓'}
                  </div>
                  <span className={`text-sm flex-1 truncate ${task.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{task.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-red-900 text-red-300' :
                    task.priority === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-800 text-gray-400'
                  }`}>{task.priority}</span>
                </div>
              )) : (
                <p className="text-gray-600 text-sm text-center py-4">No tasks yet.</p>
              )}
            </div>
          </div>

          {/* Habits Progress */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Habit Strength</h3>
              <button onClick={() => navigate('/habits')} className="text-blue-400 text-xs hover:text-blue-300">Track</button>
            </div>
            <div className="space-y-3">
              {habits.length > 0 ? habits.map((habit) => (
                <div key={habit.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 truncate w-32">{habit.name}</span>
                    <span className="text-blue-400">{habit.strength}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full transition-all duration-500" style={{width: `${habit.strength}%`}}></div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-600 text-sm text-center py-4">No habits yet.</p>
              )}
            </div>
          </div>

          {/* Daily Performance */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Performance</h3>
            <p className="text-gray-500 text-xs mb-4">Overall Completion</p>
            <div className="flex items-center justify-center my-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10"
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (habits.reduce((acc, h) => acc + h.strength, 0) / (habits.length || 1)) / 100)}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + h.strength, 0) / habits.length) : 0}%
                  </span>
                  <span className="text-gray-500 text-[10px]">STRENGTH</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-center">
                <p className="text-gray-500 text-[10px]">TASKS</p>
                <p className="text-white font-bold text-lg">{tasks.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-[10px]">ENTRIES</p>
                <p className="text-white font-bold text-lg">{journals.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Journal */}
          <div className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 text-center md:text-left">
              <div>
                <h3 className="text-white font-semibold">Recent Journal</h3>
                <p className="text-gray-500 text-xs">Daily reflections and thoughts</p>
              </div>
              <button onClick={() => navigate('/journal')} className="text-blue-400 text-xs hover:text-blue-300">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {journals.length > 0 ? journals.map((j) => (
                <div key={j.id} className="bg-[#0d1117] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-[10px]">{formatDate(j.created_at)}</span>
                    <div className="flex items-center gap-2">
                      {j.mood_score && <span className="text-xs">{(j.mood_score >= 8 ? '🤩' : j.mood_score >= 6 ? '🙂' : j.mood_score >= 4 ? '😕' : '😫')}</span>}
                      <span className="text-[10px] bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{j.tag}</span>
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1 truncate">{j.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{j.content}</p>
                </div>
              )) : (
                <div className="col-span-2 text-center py-6 border border-dashed border-gray-800 rounded-xl">
                  <p className="text-gray-600 text-sm italic">Write your first reflection today</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Quick Actions</h3>
            <p className="text-gray-500 text-xs mb-4">One-tap navigation</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'TASKS', path: '/tasks', icon: '☑' },
                { label: 'HABITS', path: '/habits', icon: '🔥' },
                { label: 'JOURNAL', path: '/journal', icon: '📓' },
                { label: 'INSIGHTS', path: '/insights', icon: '↗' },
              ].map((action) => (
                <button key={action.label} onClick={() => navigate(action.path)} className="bg-[#0d1117] border border-gray-800 rounded-xl p-3 flex flex-col items-center gap-1 hover:border-blue-700 transition group">
                  <div className="text-xl group-hover:scale-110 transition">{action.icon}</div>
                  <span className="text-gray-400 text-[10px]">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
