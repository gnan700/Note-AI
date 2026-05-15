"use client";
import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, onClose, children, size = "md" }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      case "full":
        return "max-w-7xl mx-4";
      default:
        return "max-w-md";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Modal container */}
      <div
        ref={modalRef}
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full ${getSizeClasses()} transform transition-all duration-500 ease-out`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/5 rounded-3xl pointer-events-none" />
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100/80 hover:bg-red-100/80 backdrop-blur-sm border border-gray-200/50 hover:border-red-200/50 text-gray-500 hover:text-red-500 transition-all duration-200 hover:scale-110 hover:rotate-90 group shadow-lg hover:shadow-red-500/20"
          aria-label="Close modal"
        >
          <FiX className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        </button>

        {/* Content wrapper */}
        <div className="relative z-10 p-6">
          {children}
        </div>

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-3xl opacity-60" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}