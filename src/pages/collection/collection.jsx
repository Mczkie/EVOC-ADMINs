import React, { useEffect, useState, useRef } from "react";
import "../collection/collection.css";
import CollectionButton from "../../components/collectionButton/collectionButton";

function Collection() {
  const [schedules, setSchedules] = useState([]);
  const [location, setLocation] = useState("");
  const [street, setStreet] = useState("");
  const [collectionDate, setCollectionDate] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const firstInputRef = useRef(null);
  const updateRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5;

  const API = "https://evoc-backends.onrender.com/api/collection";

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Failed to fetch schedules");

      const data = await response.json();
      setSchedules(data);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch schedules");
    }
  };

  useEffect(() => {
    fetchSchedules();

    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // ADD schedule
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!location || !street || !collectionDate) {
      setError("Location, Street and Collection Date are required!");
      return;
    }

    const newSchedule = {
      location,
      street,
      date: collectionDate,
    };

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSchedule),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSchedules((prev) => [...prev, data]);

      setSuccessMessage("Schedule added successfully!");

      setLocation("");
      setStreet("");
      setCollectionDate("");

      setCurrentPage(1);
      setShowModal(false);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // UPDATE schedule
  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    const id = updateRef.current;

    if (!id) {
      setError("Invalid schedule ID");
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          street,
          date: collectionDate,
        }),
      });

      const updatedData = await response.json();

      if (!response.ok) {
        throw new Error(updatedData.message);
      }

      setSchedules((prev) =>
        prev.map((item) => (item.id === id ? updatedData : item))
      );

      setSuccessMessage("Schedule updated successfully!");

      setShowUpdateModal(false);

      setLocation("");
      setStreet("");
      setCollectionDate("");

      updateRef.current = null;

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Pagination
  const totalPages = Math.ceil(schedules.length / schedulesPerPage);
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;

  const currentSchedules = schedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="scheduleWrapper">

      <div className="headers">
        <h2>Collection Schedules</h2>

        <button onClick={() => setShowModal(true)}>
          Add new collection schedule
        </button>
      </div>

      <div className="scheduleCard">

        <table>

          <thead>
            <tr>
              <th>Location</th>
              <th>Street</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentSchedules.length === 0 ? (

              <tr>
                <td colSpan="4">No schedules available</td>
              </tr>

            ) : (

              currentSchedules.map((schedule) => (

                <tr key={schedule.id}>

                  <td>{schedule.location}</td>

                  <td>{schedule.street}</td>

                  <td>
                    {new Date(schedule.date).toLocaleDateString()}
                  </td>

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
                        setCollectionDate(date.split("T")[0]);

                        updateRef.current = id;

                        setShowUpdateModal(true);
                      }}
                    />

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

        {/* Pagination */}

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

      </div>

      {/* ADD MODAL */}

      {showModal && (

        <div className="modalOverlay">

          <div className="modalContent">

            <h2>Add New Collection Schedule</h2>

            <form onSubmit={handleSubmit} className="scheduleForm">

              <input
                ref={firstInputRef}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                required
              />

              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street"
                required
              />

              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
              />

              <div className="buttons">

                <button type="submit">
                  Add
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* UPDATE MODAL */}

      {showUpdateModal && (

        <div className="modalOverlay">

          <div className="modalContent">

            <h2>Update Collection Schedule</h2>

            <form onSubmit={handleUpdate} className="scheduleForm">

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />

              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
              />

              <div className="buttons">

                <button type="submit">
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Collection;