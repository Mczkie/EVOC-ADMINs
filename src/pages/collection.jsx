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

    fetch("http://localhost:5000/api/collection-schedule", {
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
    <div className="scheduleBody">
      <h1>Collection Schedule</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <input
          type="date"
          value={collectionDate}
          onChange={(e) => setCollectionDate(e.target.value)}
        />
        <button type="submit">Add Schedule</button>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>

      <h2>Existing Schedules</h2>
      <div className="scheduleList">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="scheduleItem">
            <h3>{schedule.location}</h3>
            <p>{new Date(schedule.collection_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collection;
