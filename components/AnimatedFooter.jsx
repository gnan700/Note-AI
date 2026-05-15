// components/AnimatedFooter.jsx
'use client';

export default function AnimatedFooter() {
  return (
    <footer className="py-6 text-center bg-black/10 backdrop-blur-sm">
      <div className="inline-flex items-center text-sm gap-1">
        <span className="text-white/90">Made with</span>
        <span className="text-red-500 text-lg animate-pulse" style={{ animationDuration: '1.5s' }}>❤️</span>
        <span className="text-white/90">by</span>
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">
          Gnandeep
        </span>
      </div>
    </footer>
  );
}