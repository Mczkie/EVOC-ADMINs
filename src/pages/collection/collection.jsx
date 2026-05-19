import React, { useEffect, useState, useRef } from "react";
import "../collection/collection.css";
import { FaCalendarPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Collection() {
  const [fixedSchedules, setFixedSchedules] = useState([]);
  const [barangay, setBarangay] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
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
    if (!barangay || !collectionType || !date || !time || !title) {
      setError("All fields are required!");
      return;
    }

    try {
      const res = await fetch(FIXED_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          time,
          barangay,
          date: formatDate(date),
          collectionType,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to add");

      setFixedSchedules((prev) => [...prev, data]);
      setShowFixedModal(false);
      setBarangay("");
      setCollectionType("");
      setTitle("");
      setDate("");
      setTime("");
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
        body: JSON.stringify({
          title,
          time,
          barangay,
          date: formatDate(date),
          collection_type: collectionType,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setFixedSchedules((prev) =>
        prev.map((item) => (item.id === id ? data : item)),
      );

      setShowFixedUpdateModal(false);
      fixedUpdateRef.current = null;

      setBarangay("");
      setCollectionType("");
      setTitle("");
      setDate("");
      setTime("");

      setSuccessMessage("Fixed schedule updated!");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formatDisplayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDisplayTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="scheduleWrapper">
      <h2 className="Schedule-header-title">📅 Fixed Collection Schedules</h2>
      <p>Manage and view collection schedules</p>

      <section className="calendarAndaddAnnouncement">
        <div className="calendar-container">
          <h3>Select Date</h3>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            inline
          />
        </div>

        <div className="addAnnouncement-container">
          <p className="addAnnouncement-title">
            Schedules for {selectedDate.toDateString()}
          </p>
          <div className="addCollection-container">
            <div className="addCollection-header">
              <FaCalendarPlus size={30} color="#6b7280" fill="#6b7280" />
              <h1 className="NoSchedule">No schedules for this date </h1>
            </div>
            <button
              className="add-fixed"
              onClick={() => setShowFixedModal(true)}
            >
              Create New a Schedule
            </button>
          </div>
        </div>
      </section>

      <section className="collection-table-section">
        <div className="collection-table-container">
          <h1 className="upcoming-title">Upcoming Schedule</h1>
          {currentSchedules.map((sched) => (
            <div className="schedule-card" key={sched.id}>
              {/* Left: Barangay */}
              <div className="info">
                <h3>{sched.barangay}</h3>
                
                <p>{sched.collection_type}</p>
                <small>
                  {formatDisplayDate(sched.date)} •{" "}
                  {formatDisplayTime(sched.time)}
                </small>
              </div>

              {/* Right: optional status or actions */}
              <div className="status scheduled">Scheduled</div>
            </div>
          ))}
        </div>
      </section>

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
        <div className="collection-modalOverlay">
          <div className="collection-modalContent">
            <h2>Create New Schedule</h2>
            <p>Schedule a new waste collection</p>
            <form onSubmit={handleSubmitFixed} className="new-collection">
              <div className="Title-Container">
                <label htmlFor="Title">Title</label>
                <input
                  className="title-input"
                  type="text"
                  placeholder="Enter Schedule Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="inputs-hero">
                <div className="barangay-container">
                  <label htmlFor="barangay">Barangay</label>
                  <input
                    className="barangay-input"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    placeholder="Barangay"
                    required
                  />
                </div>
                <div className="schedule-container">
                  <label htmlFor="schedule">Collection Type</label>
                  <select
                    className="schedule-select"
                    value={collectionType}
                    onChange={(e) => setCollectionType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Special Waste">Special Waste</option>
                  </select>
                </div>
              </div>

              <div className="Time-container">
                <div className="date-container">
                  <label htmlFor="date">Date</label>
                  <input
                    className="date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="Time-hero">
                  <label htmlFor="time">Time</label>
                  <input
                    className="time-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Time"
                    required
                  />
                </div>
              </div>
              <div className="collection-button-container">
                <button
                  type="button"
                  onClick={() => setShowFixedModal(false)}
                  className="collection-cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="collection-add-button">
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE FIXED MODAL
      {showFixedUpdateModal && (
        <div className="collection-modalOverlay">
          <div className="collection-modalContent">
            <h2>Update Fixed Schedule</h2>
            <form onSubmit={handleUpdateFixed}>
              <div className="collection-inputs">
                <label htmlFor="barangay">Barangay</label>
                <input
                  className="barangay-input"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  placeholder="Barangay"
                  required
                />
              </div>
              <div>
                <label htmlFor="schedule">Schedule</label>
                <input
                  className="schedule-input"
                  value={scheduleText}
                  onChange={(e) => setScheduleText(e.target.value)}
                  placeholder="Schedule"
                  required
                />
              </div>
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
      )} */}
    </div>
  );
}

export default Collection;
