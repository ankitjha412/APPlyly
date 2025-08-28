import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateName: "",
    role: "",
    experience: "",
    skills: "",
  });
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const form = new FormData();
      form.append("candidateName", formData.candidateName);
      form.append("role", formData.role);
      form.append("experience", formData.experience);
      form.append("skills", formData.skills);

      if (resume) form.append("resume", resume);
      if (profileImage) form.append("profileImage", profileImage);

      await api.post("/applications", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Candidate added successfully!");
      setLoading(false);

      setTimeout(() => navigate("/applications"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add candidate.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h bg-gray-900">
      <div className="max-w-2xl w-full bg-gray-800 text-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Candidate</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Candidate Name</label>
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block mb-1">Resume (PDF)</label>
            <label className="flex flex-col items-center justify-center w-full h-10 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
              <span className="text-sm text-gray-300">
                {resume ? resume.name : "Click to upload Resume (PDF)"}
              </span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block mb-1">Profile Image (optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-10 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
              <span className="text-sm text-gray-300">
                {profileImage ? profileImage.name : "Click to upload Profile Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-white hover:bg-black rounded font-medium hover:text-white text-black cursor-pointer"
          >
            {loading ? "Saving..." : "Add Candidate"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-white">{message}</p>
        )}
      </div>
    </div>
  );
}
