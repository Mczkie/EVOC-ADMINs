import React, { useEffect, useState } from 'react';
import '../styles/collection.css';
import CollectionButton from '../components/collectionButton/collectionButton';

function Collection() {
  const [schedules, setSchedules] = useState([]);
  const [location, setLocation] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5;

  // Fetch schedules from backend
  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/collection");
      if (!response.ok) throw new Error("Failed to fetch schedules");
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to fetch schedules");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!location || !collectionDate) {
      setError("Location and Collection Date are required!");
      return;
    }

    const newSchedule = { location, date: collectionDate }; // match backend

    try {
      const response = await fetch("http://localhost:5001/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add schedule");
      }

      const createdSchedule = await response.json();

      setSuccessMessage("Schedule added successfully!");
      setSchedules((prev) => [...prev, createdSchedule]); // add new schedule
      setLocation("");
      setCollectionDate("");
      setCurrentPage(1); // reset to first page
    } catch (err) {
      console.error("Error adding schedule:", err);
      setError(`Error adding schedule: ${err.message}`);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(schedules.length / schedulesPerPage);
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="scheduleWrapper">
      <form onSubmit={handleSubmit} className="scheduleForm">
        <h2 className="headingSche">Collection Schedule</h2>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="inputField"
          list="locations"
          required
        />
        <datalist id='locations'>
          <option value="East Bajac Bajac"/>
          <option value="West Bajac Bajac" />
          <option value="Elicano" />
          <option value="Sta. Rita" />
          <option value="Gordon Heights" />
          <option value="Anonas St." />
        </datalist>
        <input
          type="date"
          value={collectionDate}
          onChange={(e) => setCollectionDate(e.target.value)}
          className="inputField"
        />
        <button type="submit" className="submitButton">Add</button>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>

      <div className="scheduleCard">
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSchedules.length === 0 ? (
              <tr>
                <td colSpan="2">No schedules available</td>
              </tr>
            ) : (
              currentSchedules.map((schedule) => (
                <tr key={schedule.id || `${schedule.location}-${schedule.date}`}>
                  <td>{schedule.location}</td>
                  <td>{new Date(schedule.date).toLocaleDateString()}</td>
                  <td>
                    <CollectionButton
                      id={schedule.id || `${schedule.location}-${schedule.date}`}
                      location={schedule.location}
                      setCollection={setSchedules}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Collection;
