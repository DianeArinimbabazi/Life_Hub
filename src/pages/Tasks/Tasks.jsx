import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import supabase from '../../supabaseClient';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', tag: '', due_date: '', group_name: 'today' });
  const isSaving = useRef(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (!error) setTasks(data);
    setLoading(false);
  };

  const saveTask = async () => {
    if (!newTask.title || isSaving.current) return;
    isSaving.current = true;
    const { data: { user } } = await supabase.auth.getUser();

    if (isEditing && newTask.id) {
      const { error } = await supabase.from('tasks').update({ 
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        tag: newTask.tag,
        due_date: newTask.due_date,
        group_name: newTask.group_name
      }).eq('id', newTask.id);
      
      if (!error) {
        await fetchTasks();
        setSelected(null);
        toast.success('Task updated');
      } else {
        toast.error('Failed to update task');
      }
    } else {
      const { error } = await supabase.from('tasks').insert({ ...newTask, user_id: user.id });
      if (!error) {
        await fetchTasks();
        toast.success('Task created');
      } else {
        toast.error('Failed to create task');
      }
    }

    setShowModal(false);
    setIsEditing(false);
    setNewTask({ title: '', description: '', priority: 'Medium', tag: '', due_date: '', group_name: 'today' });
    isSaving.current = false;
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      await fetchTasks();
      setSelected(null);
      toast.success('Task deleted');
    } else {
      toast.error('Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setNewTask(task);
    setIsEditing(true);
    setShowModal(true);
  };

  const toggleDone = async (task) => {
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id);
    if (!error) fetchTasks();
  };

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const today = filtered.filter(t => t.group_name === 'today' && !t.done);
  const upcoming = filtered.filter(t => t.group_name === 'upcoming' && !t.done);
  const completed = filtered.filter(t => t.done);

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
        onClick={(e) => { e.stopPropagation(); toggleDone(task); }}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${task.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600'}`}
      >
        {task.done && '✓'}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{task.due_date} • {task.tag}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(task.priority)}`}>{task.priority}</span>
    </div>
  );

  return (
    <div className="bg-[#0d1117] min-h-screen text-white flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-56 flex-1 flex flex-col lg:flex-row">

        <div className="flex-1 p-4 md:p-6 border-r border-gray-800 pt-16 md:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-bold">All Tasks</h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-700 text-gray-400 px-3 py-1.5 rounded-lg text-xs md:text-sm hover:border-gray-500 transition">Filters</button>
              <button onClick={() => { setIsEditing(false); setNewTask({ title: '', description: '', priority: 'Medium', tag: '', due_date: '', group_name: 'today' }); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition">+ New Task</button>
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
          </div>

          {loading ? (
            <p className="text-gray-500 text-center mt-20">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-gray-400 text-lg font-semibold">No tasks yet</p>
              <p className="text-gray-600 text-sm mt-2">Click "+ New Task" to add your first task</p>
            </div>
          ) : (
            <>
              {today.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-sm font-semibold uppercase">Today</span>
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{today.length}</span>
                  </div>
                  <div className="space-y-2">{today.map(t => <TaskRow key={t.id} task={t} />)}</div>
                </div>
              )}
              {upcoming.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-sm font-semibold uppercase">Upcoming</span>
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{upcoming.length}</span>
                  </div>
                  <div className="space-y-2">{upcoming.map(t => <TaskRow key={t.id} task={t} />)}</div>
                </div>
              )}
              {completed.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-sm font-semibold uppercase">Completed</span>
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{completed.length}</span>
                  </div>
                  <div className="space-y-2">{completed.map(t => <TaskRow key={t.id} task={t} />)}</div>
                </div>
              )}
            </>
          )}
        </div>

        {selected && (
          <div className="w-full lg:w-80 p-6 flex flex-col border-t lg:border-t-0 border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase">Task Preview</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-lg">×</button>
            </div>
            <div className="flex-1">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(selected.priority)}`}>{selected.tag}</span>
              <h2 className="text-xl font-bold mt-3 mb-1">{selected.title}</h2>
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="bg-[#161b22] rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">DUE DATE</p>
                  <p className="text-white text-sm font-medium">{selected.due_date || 'No date'}</p>
                </div>
                <div className="bg-[#161b22] rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">PRIORITY</p>
                  <p className={`text-sm font-medium ${selected.priority === 'High' ? 'text-red-400' : selected.priority === 'Medium' ? 'text-yellow-400' : 'text-gray-400'}`}>{selected.priority}</p>
                </div>
              </div>
              {selected.description && (
                <div>
                  <p className="text-gray-500 text-xs mb-2 uppercase">Description</p>
                  <p className="text-gray-300 text-sm">{selected.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-6 border-t border-gray-800 mt-6">
              <button
                onClick={() => openEditModal(selected)}
                className="flex-1 border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-gray-500 hover:text-white transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(selected.id)}
                className="flex-1 border border-red-900 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-900 hover:text-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{isEditing ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="text-gray-500 hover:text-white">×</button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select
                  value={newTask.group_name}
                  onChange={(e) => setNewTask({ ...newTask, group_name: e.target.value })}
                  className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Tag (e.g. Work, Personal)"
                value={newTask.tag}
                onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Due date (e.g. Today, 5:00 PM)"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={saveTask}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {isEditing ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
