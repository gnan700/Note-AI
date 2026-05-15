"use client";

import { useEffect, useState } from "react";
import useStore from "@/store";
import { FiPlus, FiTrash2, FiLoader, FiCheckSquare, FiSquare, FiTrendingUp, FiFilter, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

export default function TasksPage() {
  const { tasks, setTasks, loading, setLoading } = useStore();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle("");
      toast.success("Task added successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDone = async (task) => {
    // Optimistic update
    setTasks(tasks.map((t) =>
      t._id === task._id ? { ...t, done: !t.done } : t
    ));

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !task.done, title: task.title }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
      toast.success(updated.done ? "Task completed!" : "Task reopened");
    } catch (err) {
      toast.error(err.message);
      // Revert optimistic update
      setTasks(tasks.map((t) =>
        t._id === task._id ? { ...t, done: !t.done } : t
      ));
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" ||
      (filter === "completed" && task.done) ||
      (filter === "pending" && !task.done);
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(task => task.done).length;
  const pendingCount = tasks.filter(task => !task.done).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Your Tasks
            </h1>
            <p className="text-slate-600 mt-2">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {completionRate}% completed
            </p>
          </div>

          <div className="flex gap-4 animate-slide-up delay-100">
            {/* Search Bar */}
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 w-64"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-slate-700"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 animate-slide-up delay-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
                <FiCheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-800">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 animate-slide-up delay-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
                <FiSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 animate-slide-up delay-400">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl">
                <FiTrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-800">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up delay-500">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-slate-800">Progress</h3>
              <span className="text-sm font-medium text-slate-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="mb-8 animate-slide-up delay-600">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <form onSubmit={addTask} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full border border-slate-200 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:shadow-md text-slate-800 placeholder-slate-400"
                  placeholder="Add a new task..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin w-5 h-5" />
                ) : (
                  <FiPlus className="w-5 h-5" />
                )}
                Add Task
              </button>
            </form>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <FiLoader className="animate-spin text-3xl text-slate-400" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border border-white/20 animate-fade-in">
            <div className="text-slate-400 mb-4">
              <FiSearch className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-2">
              {searchTerm ? "No tasks match your search" : "No tasks yet"}
            </h3>
            <p className="text-slate-500">
              {searchTerm
                ? "Try a different search term"
                : "Add your first task using the form above"}
            </p>
          </div>
        ) : (
          <ul className="space-y-4 animate-fade-in delay-700">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group"
              >
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-4 cursor-pointer flex-1">
                    <button
                      onClick={() => toggleDone(task)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${task.done
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'border-2 border-slate-300 hover:border-green-500 text-transparent'
                        }`}
                    >
                      {task.done ? <FiCheckSquare className="w-4 h-4" /> : ''}
                    </button>
                    <span
                      className={`text-lg ${task.done
                          ? 'line-through text-slate-400'
                          : 'text-slate-700'
                        }`}
                    >
                      {task.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Delete task"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}