'use client';
import { useState } from "react";
import { FiEdit, FiTrash2, FiX, FiMaximize2, FiCopy, FiShare2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";

export default function NoteCard({ note, onEdit, onDelete, index = 0 }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSummarize = async () => {
    if (!note.content.trim()) {
      setError("Note content is empty");
      toast.error("Note content is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note.content }),
      });

      if (!res.ok) throw new Error("Summarization failed");

      const data = await res.json();
      setSummary(data.summary);
      setShowModal(true);
      toast.success("Summary generated!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy(note.content);
    }
  };

  const truncatedContent = note.content.length > 150 
    ? note.content.substring(0, 150) + "..." 
    : note.content;

  return (
    <div
      className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 transition-all duration-300 ${
        isHovered ? 'scale-[1.02] -translate-y-2 shadow-blue-500/20' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            {note.title}
          </h3>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
            aria-label={isExpanded ? "Collapse note" : "Expand note"}
          >
            <FiMaximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {isExpanded ? note.content : truncatedContent}
          </p>
          
          {note.content.length > 150 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium transition-colors duration-200"
            >
              Read more
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(note)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            aria-label="Edit note"
          >
            <FiEdit className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => onDelete(note._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Delete note"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>

          <button
            onClick={() => handleCopy(note.content)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Copy note"
          >
            <FiCopy className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Share note"
          >
            <FiShare2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleSummarize}
            disabled={loading || !note.content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            aria-label="Summarize note"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiSparkles className="w-4 h-4" />
            )}
            {loading ? "Processing..." : "AI Summary"}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
            <p className="text-red-600 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              {error}
            </p>
          </div>
        )}
      </div>

      {/* AI Summary Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold">AI Summary</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto flex-grow">
            {summary ? (
              <div className="prose prose-sm max-w-none">
                {summary.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-gray-700 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No summary available</p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <HiSparkles className="w-3 h-3 text-emerald-500" />
              <span>Generated from your note content</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(summary)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={!summary}
              >
                Copy
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}