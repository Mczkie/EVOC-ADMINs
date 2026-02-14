import React, { useEffect, useState, useRef } from "react";
import "../collection/collection.css";
import CollectionButton from "../../components/collectionButton/collectionButton";

function Collection() {
  const [schedules, setSchedules] = useState([]);
  const [street, setStreet] = useState("");
  const [location, setLocation] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [barangay, setBarangay] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // modal for update
  const updateRef = useRef(null);


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
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
    fetchSchedules();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!location || !street || !collectionDate) {
      setError("Location, Street and Collection Date are required!");
      return;
    }

    const newSchedule = { location, street: street, date: collectionDate }; // match backend

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
      setStreet("");
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
  const currentSchedules = schedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // fetch all barangays
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./ebb.json", {
          headers: {
            "Content-Type:": "application/json",
            Accept: "application/json",
          },
        });
        const json = await response.json();
        setBarangay(json);
      } catch (error) {
        return "No data";
      }
    };
    fetchData();
  }, []);

  const firstInputRef = useRef(null);

  const handleUpdate = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  if (!location || !street || !collectionDate) {
    setError("Location, Street and Collection Date are required!");
    return;
  }

  const id = updateRef.current; // get id from ref
  if (!id) {
    setError("Invalid schedule ID");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5001/api/collection/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, street, date: collectionDate }),
      }
    );

    const updatedData = await response.json();

    if (!response.ok) {
      throw new Error(updatedData.message || "Failed to update schedule");
    }

    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? updatedData : item))
    );

    setSuccessMessage("Schedule updated successfully!");
    setShowUpdateModal(false);
    setLocation("");
    setStreet("");
    setCollectionDate("");
    updateRef.current = null; // reset ref
  } catch (err) {
    console.error("Error updating schedule:", err);
    setError(`Error updating schedule: ${err.message}`);
  }
};


  return (
    <div className="scheduleWrapper">
      <div className="headers">
        <h2>Collection Schedules</h2>
        <button type="button" onClick={() => setShowModal(true)}>
          Add new collection schedule
        </button>
      </div>

      <div className="scheduleCard">
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Streets</th>
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
                <tr
                  key={schedule.id || `${schedule.location}-${schedule.date}`}
                >
                  <td>{schedule.location}</td>
                  <td>{schedule.street}</td>
                  <td>{new Date(schedule.date).toLocaleDateString()}</td>
                  <td>
                    <CollectionButton
                      id={schedule.id}
                      location={schedule.location}
                      street={schedule.street}
                      date={schedule.date}
                      setCollection={setSchedules}
                      onUpdate={(id, location, street, date) => {
                        setLocation(location);
                        setStreet(street);
                        setCollectionDate(date ? date.split("T")[0] : "");
                        setShowUpdateModal(true);

                        // store id in ref
                        updateRef.current = id;
                      }}
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
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {showModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Add New Collection Schedule</h2>
              {error && <p className="errorMessage">{error}</p>}
              <form onSubmit={handleSubmit} className="scheduleForm">
                <input
                  ref={firstInputRef}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="inputField"
                  list="locations"
                  required
                />
                <datalist id="locations">
                  <option value="East Bajac Bajac" />
                  <option value="West Bajac Bajac" />
                  <option value="Elicano" />
                  <option value="Sta. Rita" />
                  <option value="Gordon Heights" />
                  <option value="Anonas St." />
                </datalist>
                {/* Streets */}
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street"
                  className="inputField"
                  list="streets"
                  required
                />
                <datalist id="streets">
                  <option value="Canda Street" />
                  <option value="18th Street" />
                  <option value="26th Street" />
                  <option value="24th Street" />
                  <option value="23rd Street" />
                  <option value="25th Street" />
                </datalist>
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="inputField"
                />
                <div className="buttons">
                  <button type="submit" className="submitButton">
                    Add
                  </button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
              </form>
            </div>
          </div>
        )}

        {/* update modal */}

        {showUpdateModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Update Collection Schedule</h2>
              {error && <p className="errorMessage">{error}</p>}
              {successMessage && (
                <p className="successMessage">{successMessage}</p>
              )}
              <form onSubmit={handleUpdate} className="scheduleForm">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="inputField"
                  required
                />
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street"
                  className="inputField"
                  required
                />
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="inputField"
                />
                <div className="buttons">
                  <button type="submit" className="submitButton">
                    Update
                  </button>
                  <button onClick={() => setShowUpdateModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Collection;
