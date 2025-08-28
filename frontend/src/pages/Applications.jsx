import { useEffect, useState } from "react";
import api from "../utils/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

const STAGES = ["Applied", "Interview", "Offer", "Rejected"];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: "", status: "", exp: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      setApps(res.data);
    } catch (err) {
      console.error("Error fetching apps:", err);
    }
    setLoading(false);
  };

  // Handle Drag + Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const draggedApp = apps.find((a) => a._id === result.draggableId);

    const updatedApps = apps.map((a) =>
      a._id === draggedApp._id ? { ...a, status: destination.droppableId } : a
    );
    setApps(updatedApps);

    try {
      await api.patch(`/applications/${draggedApp._id}/status`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      fetchApps(); // fallback refresh
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    try {
      await api.delete(`/applications/${id}`);
      setApps((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting candidate:", err);
    }
  };

  // Apply filters
  const filteredApps = apps.filter((a) => {
    const matchesRole = filters.role
      ? (a.role || "").toLowerCase().includes(filters.role.toLowerCase())
      : true;

    const matchesStatus = filters.status ? a.status === filters.status : true;
    const matchesExp = filters.exp ? a.experience >= Number(filters.exp) : true;
    return matchesRole && matchesStatus && matchesExp;
  });

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
     <div className="p-6 text-white">
    {/* App Name */}

    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-black">Applications </h1>
      <button
        onClick={() => navigate("/apply")}
        className="px-4 py-2  bg-white font-bold hover:bg-black hover:text-white rounded  text-black cursor-pointer"
      >
        + Add Candidate
      </button>
    </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Role"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">All Status</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Experience"
          value={filters.exp}
          onChange={(e) => setFilters({ ...filters, exp: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {STAGES.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-900 rounded-lg p-4 min-h-[500px]"
                >
                  <h2 className="text-lg font-semibold mb-4">{stage}</h2>

                  {filteredApps
                    .filter((app) => app.status === stage)
                    .map((app, index) => (
                      <Draggable
                        key={app._id}
                        draggableId={app._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-700 p-3 mb-3 rounded shadow hover:bg-gray-600 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 justify-between">
                              {/* Candidate Info */}
                              <div
                                onClick={() =>
                                  navigate(`/applications/${app._id}`)
                                }
                                className="flex items-center gap-3 flex-1"
                              >
                                {app.profileImage ? (
                                  <img
                                    src={app.profileImage}
                                    alt={app.candidateName}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                                  />
                                ) : (
                                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-sm font-bold">
                                    {app.candidateName?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold">
                                    {app.candidateName}
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {app.role}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {app.experience} yrs
                                  </p>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(app._id)}
                                className="ml-2 px-2 py-1 bg-white font-bold hover:bg-black hover:text-white rounded text-xs text-black cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
