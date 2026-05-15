"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Loader2, 
  Brain, 
  Sparkles, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Shield,
  Cpu,
  Globe
} from "lucide-react";

export default function AuthRedirector() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    
    if (status === "authenticated") {
      if (!currentPath.startsWith("/dashboard")) {
        router.replace("/dashboard");
      }
    } else if (status === "unauthenticated") {
      if (!currentPath.startsWith("/login")) {
        router.replace("/login");
      }
    }

    // Show features after a delay
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, router]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Summaries",
      description: "Get intelligent summaries of your notes with GPT-3.5",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized performance for seamless productivity",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Smart Organization",
      description: "Automatically organize your notes and tasks",
      color: "from-indigo-400 to-purple-500"
    }
  ];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="animated-bg"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Main loading content */}
        <div className="glass p-12 rounded-3xl text-center max-w-md mx-4 fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 gradient-text">
            NotePilot AI
          </h1>
          <p className="text-white/80 mb-6">
            Initializing your AI-powered workspace...
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">
              {status === "loading" ? "Verifying session..." : "Loading workspace..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="animated-bg"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Logo and Title */}
          <div className="slide-in-down mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6 card-3d">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 text-shadow-lg">
              NotePilot
              <span className="gradient-text"> AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Your AI-powered productivity companion for notes, tasks, and intelligent summaries
            </p>
          </div>

          {/* Call to Action */}
          <div className="slide-in-up mb-16">
            <button
              onClick={() => router.push("/login")}
              className="btn-3d bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Features Grid */}
          {showFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="stagger-item glass p-6 rounded-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-16 fade-in">
            <div className="glass p-8 rounded-3xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    <span className="gradient-text">AI-Powered</span>
                  </div>
                  <p className="text-white/70">Smart Summaries</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    <span className="gradient-text">Secure</span>
                  </div>
                  <p className="text-white/70">Data Protection</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    <span className="gradient-text">Fast</span>
                  </div>
                  <p className="text-white/70">Lightning Speed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator for redirects */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-white/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecting to your workspace...</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
}