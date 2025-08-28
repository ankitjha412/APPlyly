import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
     {/* Sidebar */}
<aside className="w-60 bg-black text-white flex flex-col justify-between">
  <div>
    {/* App Name */}
    <div className="text-center py-6 border-b border-gray-700">
      <h1 className="text-2xl font-extrabold tracking-wide">APPLYLY</h1>
    </div>

   


    <div className="flex flex-col items-center justify-center py-8 border-b border-gray-700">
  {user?.profilePic ? (
    <img
      src={user.profilePic}
      alt="Profile"
      className="w-20 h-20 rounded-full border-4 border-amber-50 object-cover"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </div>
  )}

  {/* Name & Company */}
  <div className="mt-4 text-center">
    <p className="text-lg font-semibold">{user?.name || "Unknown User"}</p>
    <p className="text-sm text-white font-bold">company - {user?.company || "No Company"}</p>
  </div>
</div>


    {/* Navigation */}
    <nav className="mt-8 flex flex-col space-y-8 px-4">
      <Link
        to="/profile"
        className="block py-2 bg-gray-900 hover:bg-gray-700 rounded text-center"
      >
        Edit Profile
      </Link>

      <Link
        to="/applications"
        className="block py-2 bg-gray-900 hover:bg-gray-700 rounded text-center"
      >
        Applications
      </Link>

      <Link
        to="/apply"
        className="block py-2 bg-gray-900 hover:bg-gray-700 rounded text-center"
      >
        Add Candidate
      </Link>

      <Link
        to="/analytics"
        className="block py-2 bg-gray-900 hover:bg-gray-700 rounded text-center"
      >
        Analyser
      </Link>
    </nav>
  </div>

  {/* Logout */}
  <div className="flex items-center justify-center py-6 border-t border-gray-700">
    <button
      onClick={logout}
      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
    >
      
      <span className="text-base font-medium cursor-pointer">Logout</span>
    </button>
  </div>
</aside>


      {/* Main content area */}
      <main className="flex-1 bg-white p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
