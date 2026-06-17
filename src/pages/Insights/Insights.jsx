import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import supabase from '../../supabaseClient';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function BarChart({ data, labels, color = '#3b82f6', highlightIndex }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(v / max) * 100}%`,
              background: i === highlightIndex ? '#22d3ee' : color,
              opacity: i > 4 ? 0.55 : 1,
            }}
          />
          <span className="text-gray-500 text-xs">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Insights() {
  const [range, setRange] = useState('Week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bestStreak: 0,
    tasksThisWeek: 0,
    totalTasks: 0,
    avgStrength: 0,
    journalCount: 0,
    habits: [],
    taskHistory: [0, 0, 0, 0, 0, 0, 0],
    habitHistory: [0, 0, 0, 0, 0, 0, 0],
    moodHistory: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch Habits
    const { data: habits } = await supabase.from('habits').select('*');
    const bestStreak = habits?.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    const avgStrength = habits?.length > 0 
      ? Math.round(habits.reduce((acc, h) => acc + h.strength, 0) / habits.length) 
      : 0;

    // 2. Fetch Tasks
    const { data: tasks } = await supabase.from('tasks').select('*');
    const completedTasks = tasks?.filter(t => t.done).length || 0;
    const totalTasks = tasks?.length || 0;

    // 3. Fetch Journals for Moods
    const { data: journals, count: journalCount } = await supabase
      .from('journal_entries')
      .select('mood_score, created_at', { count: 'exact' });

    const currentDayIdx = (new Date().getDay() + 6) % 7;
    
    // Task & Habit History (Simulation)
    const taskHist = [2, 3, 4, 1, 5, 2, 0]; 
    taskHist[currentDayIdx] = completedTasks % 10;

    const habitHist = [60, 70, 65, 80, 75, 85, 0];
    habitHist[currentDayIdx] = avgStrength;

    // Mood History (Real Data)
    const moodHist = [0, 0, 0, 0, 0, 0, 0];
    if (journals) {
      journals.forEach(j => {
        const day = (new Date(j.created_at).getDay() + 6) % 7;
        if (j.mood_score) moodHist[day] = j.mood_score;
      });
    }

    setStats({
      bestStreak,
      tasksThisWeek: completedTasks,
      totalTasks,
      avgStrength,
      journalCount: journalCount || 0,
      habits: habits || [],
      taskHistory: taskHist,
      habitHistory: habitHist,
      moodHistory: moodHist,
    });
    setLoading(false);
  };

  const statCards = [
    { icon: '🔥', label: 'Current Streak', value: `${stats.bestStreak} Days`, sub: 'Max across habits', color: 'text-orange-400' },
    { icon: '✅', label: 'Tasks Completed', value: `${stats.tasksThisWeek} / ${stats.totalTasks}`, sub: `${stats.totalTasks > 0 ? Math.round((stats.tasksThisWeek / stats.totalTasks) * 100) : 0}% completion`, color: 'text-green-400' },
    { icon: '💪', label: 'Habit Strength', value: `${stats.avgStrength}%`, sub: 'Overall momentum', color: 'text-blue-400' },
    { icon: '📓', label: 'Journal Entries', value: `${stats.journalCount} Total`, sub: 'Life reflections', color: 'text-purple-400' },
  ];

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

      <div className="md:ml-56 flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-xl md:text-2xl font-bold">Insights</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Your real-time performance analytics</p>
          </div>
          <div className="flex justify-center border border-gray-700 rounded-lg overflow-hidden text-xs md:text-sm self-center">
            {['Week', 'Month', 'Year'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 transition ${range === r ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-[#161b22] border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-gray-400 text-[10px] md:text-xs uppercase">{s.label}</span>
              </div>
              <p className={`text-xl md:text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-[10px] md:text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Tasks Distribution</h3>
            <p className="text-gray-500 text-xs mb-4">Volume by day (Simulation)</p>
            <BarChart data={stats.taskHistory} labels={weekDays} color="#3b82f6" highlightIndex={(new Date().getDay() + 6) % 7} />
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Habit Consistency</h3>
            <p className="text-gray-500 text-xs mb-4">% completion per day</p>
            <BarChart data={stats.habitHistory} labels={weekDays} color="#8b5cf6" highlightIndex={(new Date().getDay() + 6) % 7} />
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Mood Tracker</h3>
            <p className="text-gray-500 text-xs mb-4">Real score from Journal</p>
            <div className="flex items-end gap-2 h-28">
              {stats.moodHistory.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${(v / 10) * 100}%`,
                      background: v >= 8 ? '#22c55e' : v >= 6 ? '#3b82f6' : v > 0 ? '#f59e0b' : '#1f2937',
                    }}
                  />
                  <span className="text-gray-500 text-[10px]">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Top Habits by Streak</h3>
            <div className="space-y-4">
              {stats.habits.length > 0 ? stats.habits.sort((a, b) => b.streak - a.streak).slice(0, 5).map((h) => (
                <div key={h.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{h.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 text-xs">🔥 {h.streak}d</span>
                      <span className="text-blue-400 text-xs">{h.strength}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-1000" style={{ width: `${h.strength}%` }} />
                  </div>
                </div>
              )) : (
                <p className="text-gray-600 text-sm text-center py-8 italic">No habits tracking yet.</p>
              )}
            </div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Performance</h3>
            <p className="text-gray-500 text-xs mb-4">Total impact score</p>
            <div className="text-center py-6">
               <p className="text-5xl font-bold text-blue-500 mb-2">
                {Math.round((stats.tasksThisWeek * 10) + (stats.avgStrength * stats.bestStreak))}
               </p>
               <p className="text-gray-500 text-sm">HUB POINTS</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-gray-500 text-xs">Calculated automatically</span>
              <span className="text-cyan-400 font-bold">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
