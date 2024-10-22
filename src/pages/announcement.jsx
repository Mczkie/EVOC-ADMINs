import React, { useEffect, useState } from 'react';
// import '../styles/announcement.css';

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch all announcements on component mount
    fetch("http://localhost:5000/api/announcements")
      .then((response) => response.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error("Error fetching announcements:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }

    const newAnnouncement = { title, description};

    fetch("http://localhost:5000/api/newannouncements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAnnouncement),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create announcement");
        }
      })
      .then((data) => {
        console.log(data);
        setSuccessMessage("Announcement added successfully!");
        setAnnouncements([...announcements, data]); // Add new announcement to state
        setTitle("");
        setDescription("");

      })
      .catch((err) => setError("Error adding announcement"));
  };

  return (
    <div className="announcementBody">
      <h1>Announcements</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Announcement Description"
        />
        <button type="submit">Add Announcement</button>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form> 

      <h2>Existing Announcements</h2>
      <div className="announcementList">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="announcementItem">
            <h3>{announcement.title}</h3>
            <p>{announcement.description}</p>
            <p><small>{announcement.time_stamp}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcement;

