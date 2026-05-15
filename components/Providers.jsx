'use client';
import { SessionProvider, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi2";
import { FiWifi, FiWifiOff } from "react-icons/fi";

// Session loading indicator component
function SessionLoader() {
  const { status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="fixed top-4 left-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading session...</span>
      </div>
    );
  }
  return null;
}

// Loading component with fixed hydration-safe animations
function LoadingScreen() {
  const floatingDots = [
    { left: 15, top: 25, delay: 0.3, duration: 3.2 },
    { left: 75, top: 15, delay: 1.1, duration: 3.8 },
    // ... (keep your existing dot configurations)
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        {floatingDots.map((dot, index) => (
          <div
            key={`dot-${index}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float opacity-20"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-slow">
            <HiSparkles className="w-10 h-10 text-white animate-spin-slow" />
          </div>
          
          <div className="absolute inset-0 animate-spin-slow">
            {[0, 120, 240].map((rotation, i) => (
              <div
                key={`orbit-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${rotation}deg) translateY(-35px) translateX(-6px)`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Starting Your Experience
        </h2>
        <p className="text-gray-600 mb-6">
          Setting up your personalized workspace...
        </p>

        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}

// Error boundary component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setError(event.error);
    };

    const handleRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setError(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiWifiOff className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, we can fix this!
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-200 hover:scale-105"
            >
              Go Home
            </button>
          </div>
          
          {error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Technical details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return children;
}

// Network status component
function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
      <FiWifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Offline</span>
    </div>
  );
}

export default function Providers({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <SessionProvider
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <NetworkStatus />
        <SessionLoader />
        {children}
      </SessionProvider>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-progress { animation: progress 2s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </ErrorBoundary>
  );
}