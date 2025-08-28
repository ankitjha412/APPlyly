import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    company: user?.company || "",
    role: user?.role || "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put("/recruiter/update", formData);
      setMessage("✅ Profile updated successfully!");
      setLoading(false);
    } catch {
      setMessage("❌ Error updating profile");
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first");
    try {
      setLoading(true);
      const form = new FormData();
      form.append("profilePic", file);
      await api.put("/recruiter/profile-pic", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Profile picture updated!");
      setLoading(false);
      window.location.reload();
    } catch {
      setMessage("❌ Error uploading picture");
      setLoading(false);
    }
  };

  return (
    <div className="h-[100%] flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-lg h-[95%] bg-gray-800 text-white shadow-lg rounded-xl p-8 flex flex-col justify-between">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center">Profile</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-600 text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className="mt-3 flex gap-2">
           <label className="flex flex-col items-center justify-center w-40 h-10 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
  <span className="text-sm text-gray-300">Choose Image</span>
  <input
    type="file"
    onChange={(e) => setFile(e.target.files[0])}
    className="hidden"
  />
</label>
            <button
              onClick={handleUpload}
              className="px-3 py-1 bg-white text-black hover:bg-black hover:text-white rounded-md text-sm cursor-pointer"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mt-6 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-3 py-2 rounded bg-gray-600 text-gray-400 border border-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full py-2 mt-4 bg-white text-black hover:bg-black hover:text-white rounded-lg font-medium cursor-pointer"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* Status Message */}
        {message && (
          <p className="mt-2 text-center text-sm text-white">{message}</p>
        )}

        {/* Logout Button */}
        <div className="mt-4 flex justify-center">
          
        </div>
      </div>
    </div>
  );
}
