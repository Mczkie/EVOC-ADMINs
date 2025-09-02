import React, { useEffect, useState } from "react";
import "../styles/announcement.css";
import Announcebutton from "../components/announceButton/announceButton";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 3; // You can change the number of rows per page here

  useEffect(() => {
    // Fetch all announcements on component mount
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/announcement");
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }

    // Format timestamp for MySQL DATETIME
    const time_stamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    const newAnnouncement = { title, description, time_stamp };

    try {
      const response = await fetch("http://localhost:5001/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create announcement");
      }

      const data = await response.json();
      setAnnouncements((prev) => [...prev, data]);
      setTitle("");
      setDescription("");
      setSuccessMessage("Announcement added successfully!");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error submitting announcement:", err);
      setError("Error adding announcement");
    }
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(announcements.length / reportsPerPage);

  // Get current announcements based on pagination
  const indexOfLastAnnouncement = currentPage * reportsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - reportsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="contentWrapper">
      <form className="announcementForm" onSubmit={handleSubmit}>
        <h2 className="headingSche" style={{ color: "black" }}>
          Announcements
        </h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Announcement Description"
          required
        />
        <button type="submit">Add Announcement</button>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>

      <div className="announcementList">
        <table className="announcementTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAnnouncements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{announcement.title}</td>
                <td className="AnnounceDescription">{announcement.description}</td>
                <td>{announcement.time_stamp}</td>
                <td>
                  <Announcebutton
                    id={announcement.id}
                    setAnnouncements={setAnnouncements}
                  />
                </td>
              </tr>
            ))}
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
    </div>
  );
}

export default Announcement;
