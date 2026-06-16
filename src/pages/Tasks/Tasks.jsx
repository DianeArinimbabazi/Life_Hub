import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const initialTasks = [
  { id: 1, title: 'Complete Quarterly Revenue Report', due: 'Today, 5:00 PM', tag: 'Work', priority: 'High', group: 'today', done: false, description: 'Analyze the Q3 margins vs Q2 projected growth. Focus on SaaS subscription churn rates.', subtasks: ['Subtask item requirement #1', 'Subtask item requirement #2'] },
  { id: 2, title: 'Weekly Sprint Planning', due: 'Today, 10:00 AM', tag: 'Team', priority: 'High', group: 'today', done: false, description: 'Plan the upcoming sprint with the team.', subtasks: [] },
  { id: 3, title: 'Book Flight to Oslo Conference', due: 'Tomorrow', tag: 'Travel', priority: 'Medium', group: 'upcoming', done: false, description: 'Book flights for the Oslo conference.', subtasks: [] },
  { id: 4, title: 'Buy High-Performance Headphones', due: 'Friday', tag: 'Personal', priority: 'Low', group: 'upcoming', done: false, description: 'Research and buy headphones.', subtasks: [] },
  { id: 5, title: 'Update Life Hub Portfolio', due: 'Mar 15', tag: 'Design', priority: 'Medium', group: 'upcoming', done: false, description: 'Update portfolio with latest projects.', subtasks: [] },
  { id: 6, title: 'Send Project Handover Docs', due: 'Completed', tag: 'Work', priority: 'High', group: 'completed', done: true, description: 'Send all handover documents.', subtasks: [] },
];

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selected, setSelected] = useState(initialTasks[0]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', due: '', tag: 'Work', priority: 'Medium', group: 'today', description: '' });

  const addTask = () => {
    if (!newTask.title) return;
    const formattedDue = newTask.due ? new Date(newTask.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date';
    const task = { ...newTask, due: formattedDue, id: Date.now(), done: false, subtasks: [] };
    setTasks([...tasks, task]);
    setSelected(task);
    setShowModal(false);
    setNewTask({ title: '', due: '', tag: 'Work', priority: 'Medium', group: 'today', description: '' });
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const today = filtered.filter(t => t.group === 'today');
  const upcoming = filtered.filter(t => t.group === 'upcoming');
  const completed = filtered.filter(t => t.group === 'completed');

  const priorityColor = (p) => {
    if (p === 'High') return 'bg-red-900 text-red-300';
    if (p === 'Medium') return 'bg-yellow-900 text-yellow-300';
    return 'bg-gray-800 text-gray-400';
  };

  const TaskRow = ({ task }) => (
    <div
      onClick={() => setSelected(task)}
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${selected?.id === task.id ? 'border-blue-600 bg-[#161b22]' : 'border-gray-800 bg-[#161b22] hover:border-gray-600'}`}
    >
      <div
        onClick={(e) => { e.stopPropagation(); toggleDone(task.id); }}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${task.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600'}`}
      >
        {task.done && '✓'}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{task.due} • {task.tag}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(task.priority)}`}>{task.priority}</span>
    </div>
  );

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex">
      <Sidebar />
      <div className="ml-56 flex-1 flex">

        {/* Main Tasks Area */}
        <div className="flex-1 p-6 border-r border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-700 text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-gray-500 transition">Filters</button>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">+ New Task</button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2">
              <input
                type="text"
                placeholder="Search your tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-white text-sm w-full focus:outline-none placeholder-gray-600"
              />
            </div>
            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button className="px-3 py-2 text-sm text-white bg-gray-800">List</button>
              <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">Table</button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-sm font-semibold uppercase">Today</span>
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{today.length}</span>
            </div>
            <div className="space-y-2">{today.map(t => <TaskRow key={t.id} task={t} />)}</div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-sm font-semibold uppercase">Upcoming</span>
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{upcoming.length}</span>
            </div>
            <div className="space-y-2">{upcoming.map(t => <TaskRow key={t.id} task={t} />)}</div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-sm font-semibold uppercase">Completed</span>
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{completed.length}</span>
            </div>
            <div className="space-y-2">{completed.map(t => <TaskRow key={t.id} task={t} />)}</div>
          </div>
        </div>

        {/* Task Preview Panel */}
        {selected && (
          <div className="w-80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase">Task Preview</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-lg">×</button>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(selected.priority)}`}>{selected.tag}</span>
            <h2 className="text-xl font-bold mt-3 mb-1">{selected.title}</h2>
            <p className="text-gray-500 text-xs mb-6">Last updated 2 hours ago</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#161b22] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">DUE DATE</p>
                <p className="text-white text-sm font-medium">{selected.due}</p>
              </div>
              <div className="bg-[#161b22] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">PRIORITY</p>
                <p className={`text-sm font-medium ${selected.priority === 'High' ? 'text-red-400' : selected.priority === 'Medium' ? 'text-yellow-400' : 'text-gray-400'}`}>{selected.priority}</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-500 text-xs mb-2 uppercase">Description</p>
              <p className="text-gray-300 text-sm">{selected.description}</p>
            </div>
            {selected.subtasks.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs mb-3 uppercase">Subtasks ({selected.subtasks.length})</p>
                <div className="space-y-2">
                  {selected.subtasks.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-600 rounded"></div>
                      <span className="text-gray-300 text-sm">{s}</span>
                    </div>
                  ))}
                </div>
                <button className="text-blue-400 text-sm mt-3 hover:text-blue-300">+ Add subtask</button>
              </div>
            )}
          </div>
        )}
        {/* New Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">New Task</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl">×</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Title</label>
                  <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task title..." className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm transition" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Due Date</label>
                    <input type="date" value={newTask.due} onChange={e => setNewTask({...newTask, due: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm transition" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Tag</label>
                    <select value={newTask.tag} onChange={e => setNewTask({...newTask, tag: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm transition">
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Health">Health</option>
                      <option value="Learning">Learning</option>
                      <option value="Finance">Finance</option>
                      <option value="Travel">Travel</option>
                      <option value="Team">Team</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Priority</label>
                    <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm transition">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Group</label>
                    <select value={newTask.group} onChange={e => setNewTask({...newTask, group: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm transition">
                      <option value="today">Today</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase font-semibold mb-1 block">Description</label>
                  <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Optional description..." rows={3} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm transition resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={addTask} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition">Add Task</button>
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

export default Tasks;