import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import api from "../utils/api";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`).then((res) => setApp(res.data));
  }, [id]);

  if (!app) return <p className="text-white p-6">Loading...</p>;

  // ✅ Google Docs viewer URL
  const previewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    app.resumeFile
  )}&embedded=true`;

  return (
    <div className="p-6 text-white h-[99%]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-black hover:text-shadow-black cursor-pointer"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="flex gap-6 h-[calc(100%-3rem)]">
        {/* Left Panel - Candidate Info */}
        <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              {app.profileImage && (
                <img
                  src={app.profileImage}
                  alt={app.candidateName}
                  className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{app.candidateName}</h2>
                <p>
                  {app.role} • {app.experience} yrs
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {app.skills?.length > 0 ? (
                  app.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-white text-xs px-2 py-1 text-black rounded"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No skills listed</span>
                )}
              </div>
            </div>

            <p className="mt-6">
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-400">{app.status}</span>
            </p>
          </div>

          {/* Download Resume Button */}
          {app.resumeFile && (
            <a
              href={app.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-white  hover:bg-black hover:text-white text-black rounded"
            >
              <FaDownload /> Download Resume
            </a>
          )}
        </div>

        {/* Right Panel - Resume Viewer */}
        
        <div className="flex-1 bg-gray-900 rounded-lg shadow overflow-hidden">
          {app.resumeFile ? (
            <iframe
              src={previewUrl}
              title="Resume Preview"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No resume uploaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
