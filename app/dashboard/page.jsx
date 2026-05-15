"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  FiBook, 
  FiCheckSquare, 
  FiLogOut, 
  FiUser, 
  FiTrendingUp, 
  FiClock, 
  FiStar,
  FiArrowRight,
  FiPlus,
  FiActivity,
  FiTarget,
  FiZap
} from "react-icons/fi";

export default function DashboardPage() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalTasks: 0,
    completedTasks: 0,
    recentActivity: 0
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock stats - you can replace with actual API calls
  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      // Replace with actual API calls
      setStats({
        totalNotes: 12,
        totalTasks: 8,
        completedTasks: 5,
        recentActivity: 3
      });
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const quickActions = [
    {
      title: "Create Note",
      description: "Start writing your thoughts",
      icon: FiPlus,
      href: "/dashboard/notes",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700"
    },
    {
      title: "Add Task",
      description: "Track your todos",
      icon: FiTarget,
      href: "/dashboard/tasks",
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700"
    },
    {
      title: "View Activity",
      description: "Check your progress",
      icon: FiActivity,
      href: "/dashboard/notes",
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700"
    }
  ];

  const statCards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: FiBook,
      color: "from-blue-500 to-blue-600",
      trend: "+12%"
    },
    {
      title: "Active Tasks",
      value: stats.totalTasks - stats.completedTasks,
      icon: FiCheckSquare,
      color: "from-purple-500 to-purple-600",
      trend: "+8%"
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: FiStar,
      color: "from-green-500 to-green-600",
      trend: "+25%"
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: FiZap,
      color: "from-orange-500 to-orange-600",
      trend: "+15%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass-card bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Note! AI
                </h1>
                <p className="text-sm text-gray-500">{formatTime(currentTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {session?.user?.name || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to boost your productivity? Let's make today amazing.
          </p>
        </div>

        {/* Navigation Pills */}
        <div className="flex gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Link
            href="/dashboard/notes"
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
              pathname.startsWith("/dashboard/notes")
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "glass-card bg-white/60 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-white/80 hover:shadow-lg"
            }`}
          >
            <FiBook className="w-5 h-5" />
            Notes
            <FiArrowRight className="w-4 h-4 opacity-60" />
          </Link>
          <Link
            href="/dashboard/tasks"
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
              pathname.startsWith("/dashboard/tasks")
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                : "glass-card bg-white/60 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-white/80 hover:shadow-lg"
            }`}
          >
            <FiCheckSquare className="w-5 h-5" />
            Tasks
            <FiArrowRight className="w-4 h-4 opacity-60" />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="glass-card bg-white/60 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-green-600 font-medium">{stat.trend}</div>
                </div>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="lg:col-span-2 glass-card bg-white/60 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-lg animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FiTrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Welcome to your Dashboard</h3>
                <p className="text-gray-600">Your productivity hub awaits</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Organize your thoughts with intelligent notes</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Track tasks and boost your productivity</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Get AI-powered summaries and insights</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                💡 <strong>Pro tip:</strong> Use the navigation above to switch between Notes and Tasks, or try the quick actions on the right.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="glass-card bg-white/60 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className={`group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${action.color} hover:${action.hoverColor} text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm opacity-80">{action.description}</div>
                    </div>
                    <FiArrowRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card bg-white/60 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiActivity className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FiBook className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Note created</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <FiCheckSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Task completed</div>
                    <div className="text-xs text-gray-500">5 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <FiZap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">AI summary generated</div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}