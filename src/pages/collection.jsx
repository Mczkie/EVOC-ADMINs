import React, { useEffect, useState } from 'react';
// import '../styles/collectionSchedule.css';

function Collection() {
  const [schedules, setSchedules] = useState([]);
  const [location, setLocation] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch all collection schedules on component mount
    fetch("http://localhost:5000/api/collection-schedule")
      .then((response) => response.json())
      .then((data) => setSchedules(data))
      .catch((err) => console.error("Error fetching schedules:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!location || !collectionDate) {
      setError("Location and Collection Date are required!");
      return;
    }

    const newSchedule = { location, collection_date: collectionDate };

    fetch("http://localhost:5000/api/newcollection-schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSchedule),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create schedule");
        }
      })
      .then((data) => {
        setSuccessMessage("Schedule added successfully!");
        setSchedules([...schedules, data]); // Add new schedule to state
        setLocation("");
        setCollectionDate("");
      })
      .catch((err) => setError("Error adding schedule"));
  };

  return (
    <div className="scheduleWrapper">
      <form onSubmit={handleSubmit} className="scheduleForm">
        <h2 className="headingSche">Schedule</h2>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="inputField"
        />
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
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.location}</td>
                <td>{new Date(schedule.collection_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


  );
}

export default Collection;
