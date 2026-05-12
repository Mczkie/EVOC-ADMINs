import React, { useEffect, useState, useRef } from "react";
import "../collection/collection.css";

function Collection() {
  const [fixedSchedules, setFixedSchedules] = useState([]);
  const [barangay, setBarangay] = useState("");
  const [scheduleText, setScheduleText] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showFixedModal, setShowFixedModal] = useState(false);
  const [showFixedUpdateModal, setShowFixedUpdateModal] = useState(false);

  const fixedUpdateRef = useRef(null);

  const FIXED_API = "https://evoc-backend.onrender.com/api/fixedschedule";

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 9;

  // Fetch fixed schedules
  const fetchFixedSchedules = async () => {
    try {
      const res = await fetch(FIXED_API);
      const data = await res.json();
      setFixedSchedules(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFixedSchedules();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Pagination calculation
  const totalPages = Math.ceil(fixedSchedules.length / schedulesPerPage);
  const indexOfLast = currentPage * schedulesPerPage;
  const indexOfFirst = indexOfLast - schedulesPerPage;
  const currentSchedules = fixedSchedules.slice(indexOfFirst, indexOfLast);

  // ----------------- FIXED SCHEDULE CRUD -----------------
  const handleSubmitFixed = async (e) => {
    e.preventDefault();
    if (!barangay || !scheduleText) {
      setError("Barangay and Schedule are required!");
      return;
    }

    try {
      const res = await fetch(FIXED_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barangay, schedule: scheduleText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to add");

      setFixedSchedules((prev) => [...prev, data]);
      setShowFixedModal(false);
      setBarangay("");
      setScheduleText("");
      setSuccessMessage("Fixed schedule added!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateFixed = async (e) => {
    e.preventDefault();
    const id = fixedUpdateRef.current;
    if (!id) return;

    try {
      const res = await fetch(`${FIXED_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barangay, schedule: scheduleText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setFixedSchedules((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      );
      setShowFixedUpdateModal(false);
      fixedUpdateRef.current = null;
      setBarangay("");
      setScheduleText("");
      setSuccessMessage("Fixed schedule updated!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFixed = async (id) => {
    try {
      await fetch(`${FIXED_API}/${id}`, { method: "DELETE" });
      setFixedSchedules((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage("Fixed schedule deleted!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="scheduleWrapper">
      <h2>📅 Fixed Collection Schedules</h2>
      <button className="add-fixed" onClick={() => setShowFixedModal(true)}>
        Add Fixed Schedule
      </button>

      <table>
        <thead>
          <tr>
            <th>Barangay</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSchedules.map((sched) => (
            <tr key={sched.id}>
              <td>{sched.barangay}</td>
              <td>{sched.schedule}</td>
              <td>
                <button
                  onClick={() => {
                    setBarangay(sched.barangay);
                    setScheduleText(sched.schedule);
                    fixedUpdateRef.current = sched.id;
                    setShowFixedUpdateModal(true);
                  }}
                >
                  Update
                </button>
                <button onClick={() => handleDeleteFixed(sched.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {/* ADD FIXED MODAL */}
      {showFixedModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Add Fixed Schedule</h2>
            <form onSubmit={handleSubmitFixed}>
              <input
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                placeholder="Barangay"
                required
              />
              <input
                value={scheduleText}
                onChange={(e) => setScheduleText(e.target.value)}
                placeholder="Schedule"
                required
              />
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowFixedModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE FIXED MODAL */}
      {showFixedUpdateModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Update Fixed Schedule</h2>
            <form onSubmit={handleUpdateFixed}>
              <input
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                placeholder="Barangay"
                required
              />
              <input
                value={scheduleText}
                onChange={(e) => setScheduleText(e.target.value)}
                placeholder="Schedule"
                required
              />
              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => setShowFixedUpdateModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
}

export default Collection;