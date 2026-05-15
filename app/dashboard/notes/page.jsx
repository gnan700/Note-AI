"use client";

import { useEffect, useState } from "react";
import useStore from "@/store";
import NoteCard from "@/components/NoteCard";
import { FiPlus, FiEdit2, FiLoader, FiFileText, FiSearch, FiFilter } from "react-icons/fi";
import toast from "react-hot-toast";

export default function NotesPage() {
  const { notes, setNotes, loading, setLoading, error, setError } = useStore();
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/notes/${editingId}` : "/api/notes";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(editingId ? "Update failed" : "Create failed");

      const newNote = await res.json();
      
      if (editingId) {
        setNotes(notes.map((n) => (n._id === newNote._id ? newNote : n)));
        toast.success("Note updated");
        setEditingId(null);
      } else {
        setNotes([newNote, ...notes]);
        toast.success("Note created");
      }

      setForm({ title: "", content: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setNotes(notes.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", content: "" });
    setShowForm(false);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Notes
            </h1>
            <p className="text-slate-600 mt-2">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} • Organize your thoughts
            </p>
          </div>

          <div className="flex gap-4 animate-slide-up delay-100">
            {/* Search Bar */}
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-64"
              />
            </div>

            {/* Add Note Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <FiPlus className="w-5 h-5" />
              New Note
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 animate-slide-up delay-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Notes</p>
                <p className="text-2xl font-bold text-slate-800">{notes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 animate-slide-up delay-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
                <FiSearch className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Filtered</p>
                <p className="text-2xl font-bold text-slate-800">{filteredNotes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 animate-slide-up delay-400">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                <FiEdit2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Recent</p>
                <p className="text-2xl font-bold text-slate-800">{notes.slice(0, 5).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Note Form */}
        {showForm && (
          <div className="mb-8 animate-slide-up">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
                  <FiEdit2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  {editingId ? "Edit Note" : "Create New Note"}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="animate-slide-up delay-100">
                  <label htmlFor="title" className="block text-sm font-semibold mb-2 text-slate-700">
                    Title
                  </label>
                  <input
                    id="title"
                    className="w-full border border-slate-200 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:shadow-md text-slate-800 placeholder-slate-400"
                    placeholder="Enter note title..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="animate-slide-up delay-200">
                  <label htmlFor="content" className="block text-sm font-semibold mb-2 text-slate-700">
                    Content
                  </label>
                  <textarea
                    id="content"
                    className="w-full border border-slate-200 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:shadow-md text-slate-800 placeholder-slate-400 resize-none"
                    rows={6}
                    placeholder="Write your thoughts here..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex gap-4 animate-slide-up delay-300">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <FiLoader className="animate-spin w-5 h-5" />
                    ) : editingId ? (
                      <>
                        <FiEdit2 className="w-5 h-5" />
                        Update Note
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-5 h-5" />
                        Create Note
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notes Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex items-center gap-3">
              <FiLoader className="animate-spin text-3xl text-blue-600" />
              <span className="text-slate-600 text-lg">Loading your notes...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiFileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">Error loading notes</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border border-white/20 animate-slide-up">
            <div className="p-6 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? `No notes match "${searchTerm}". Try a different search term.`
                : 'Start organizing your thoughts by creating your first note!'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <div
                key={note._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NoteCard
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}