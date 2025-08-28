import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: "", type: "" });

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setToast({ message: "✅ Login successful!", type: "success" });
      } else {
        await signup(formData);
        setToast({ message: "✅ Signup successful!", type: "success" });
      }
    } catch (err) {
      setToast({ message: "❌ Something went wrong", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: "", type: "" }), 3000); // auto-hide
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Left Section: Auth Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-white text-black hover:bg-black hover:text-white rounded-lg transition font-medium flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Section: App Info */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gray-900 relative p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-400 drop-shadow-lg">
            APPlYLY
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Your smart mini ATS to{" "}
            <span className="text-indigo-400">track</span>,{" "}
            <span className="text-green-400">hire</span> &{" "}
            <span className="text-purple-400">analyze</span>
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 w-full max-w-md">
          <div className="bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-indigo-500 hover:scale-105 transform transition">
            <h3 className="text-indigo-400 font-semibold mb-1">
              Track Pipeline
            </h3>
            <p className="text-gray-400 text-sm">
              Organize candidates across stages with ease.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-purple-500 hover:scale-105 transform transition">
            <h3 className="text-purple-400 font-semibold mb-1">
              Resume Insights
            </h3>
            <p className="text-gray-400 text-sm">
              Upload resumes & view structured candidate info.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-green-500 hover:scale-105 transform transition">
            <h3 className="text-green-400 font-semibold mb-1">Analytics</h3>
            <p className="text-gray-400 text-sm">
              Visualize experience, roles & hiring progress.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-pink-500 hover:scale-105 transform transition">
            <h3 className="text-pink-400 font-semibold mb-1">Team Friendly</h3>
            <p className="text-gray-400 text-sm">
              Built for recruiters, HR & small hiring teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
