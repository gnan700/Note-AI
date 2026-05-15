"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Loader2, User, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!form.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      
      // Auto-login after registration
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (loginRes?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Join Note! AI
            </h1>
            <p className="text-gray-600">Create your account and start your productive journey</p>
          </div>

          {/* Register Form */}
          <form
            onSubmit={handleRegister}
            className="glass-card p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/80 border border-white/20 animate-slide-up"
          >
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-spin">
                    <Loader2 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">Creating your account...</p>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm ${
                    errors.name 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 animate-shake">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 animate-shake">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-14 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 animate-shake">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Minimum 6 characters required
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Account
                </div>
              )}
            </button>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card p-4 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/20 text-center hover:scale-105 transition-all duration-300">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold text-gray-800 mb-1">Secure</h3>
              <p className="text-xs text-gray-600">Protected authentication</p>
            </div>
            <div className="glass-card p-4 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/20 text-center hover:scale-105 transition-all duration-300">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold text-gray-800 mb-1">Fast</h3>
              <p className="text-xs text-gray-600">Lightning quick setup</p>
            </div>
            <div className="glass-card p-4 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/20 text-center hover:scale-105 transition-all duration-300">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <h3 className="font-semibold text-gray-800 mb-1">AI-Powered</h3>
              <p className="text-xs text-gray-600">Smart productivity tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}