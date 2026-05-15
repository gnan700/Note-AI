import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      notes: [],
      tasks: [],
      loading: false,
      error: null,

      // Synchronous setters
      setNotes: (notes) => set({ notes }),
      setTasks: (tasks) => set({ tasks }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Async actions
      fetchNotes: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/notes");
          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          set({ notes: data, loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/tasks");
          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          set({ tasks: data, loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      // Utility functions
      clearStore: () => set({ notes: [], tasks: [], loading: false, error: null }),

      // Derived state getter
      getCompletedTasks: () => get().tasks.filter(task => task.done),
    }),
    {
      name: "app-storage", // LocalStorage key
      partialize: (state) => ({ 
        notes: state.notes,
        tasks: state.tasks 
      }), // Only persist these
    }
  )
);

export default useStore;