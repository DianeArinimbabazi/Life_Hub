import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const taskData = [5, 8, 6, 9, 7, 4, 3];
const habitData = [70, 90, 75, 85, 80, 60, 50];
const moodData = [7, 8, 6, 9, 8, 7, 8];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const monthlyHabits = [65, 70, 78, 74, 82, 85];

const statCards = [
  { icon: '🔥', label: 'Current Streak', value: '12 Days', sub: 'Best: 24 days', color: 'text-orange-400' },
  { icon: '✅', label: 'Tasks This Week', value: '28 / 35', sub: '80% completion', color: 'text-green-400' },
  { icon: '💪', label: 'Habit Strength', value: '82%', sub: '+4% vs last week', color: 'text-blue-400' },
  { icon: '📓', label: 'Journal Entries', value: '6 this month', sub: '2 this week', color: 'text-purple-400' },
];

const topHabits = [
  { name: 'Evening Reading', streak: 24, pct: 100 },
  { name: 'Morning Meditation', streak: 12, pct: 92 },
  { name: 'Code Practice', streak: 8, pct: 95 },
  { name: 'Strength Training', streak: 3, pct: 88 },
  { name: 'Hydration (2L)', streak: 5, pct: 75 },
];

function BarChart({ data, labels, color = '#3b82f6', highlightIndex }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all"
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

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex">
      <Sidebar />

      <div className="ml-56 flex-1 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Insights</h1>
            <p className="text-gray-400 text-sm mt-1">Your performance analytics at a glance</p>
          </div>
          <div className="flex border border-gray-700 rounded-lg overflow-hidden text-sm">
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

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-[#161b22] border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-gray-400 text-xs uppercase">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Tasks Completed</h3>
            <p className="text-gray-500 text-xs mb-4">Daily count this week</p>
            <BarChart data={taskData} labels={weekDays} color="#3b82f6" highlightIndex={3} />
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Habit Consistency</h3>
            <p className="text-gray-500 text-xs mb-4">% completion per day</p>
            <BarChart data={habitData} labels={weekDays} color="#8b5cf6" highlightIndex={1} />
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Mood Tracker</h3>
            <p className="text-gray-500 text-xs mb-4">Self-rated score (1–10)</p>
            <div className="flex items-end gap-2 h-28">
              {moodData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${(v / 10) * 100}%`,
                      background: v >= 8 ? '#22c55e' : v >= 6 ? '#3b82f6' : '#f59e0b',
                    }}
                  />
                  <span className="text-gray-500 text-xs">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">

          {/* Top Habits */}
          <div className="col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Top Habits by Streak</h3>
            <div className="space-y-4">
              {topHabits.map((h) => (
                <div key={h.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{h.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 text-xs">🔥 {h.streak}d</span>
                      <span className="text-blue-400 text-xs">{h.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${h.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-1">Monthly Trend</h3>
            <p className="text-gray-500 text-xs mb-4">Habit success rate %</p>
            <BarChart data={monthlyHabits} labels={months} color="#22d3ee" />
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-gray-500 text-xs">6-Month Avg</span>
              <span className="text-cyan-400 font-bold">
                {Math.round(monthlyHabits.reduce((a, b) => a + b, 0) / monthlyHabits.length)}%
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Insights;
