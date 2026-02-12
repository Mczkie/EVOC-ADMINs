import React, { useEffect, useState } from "react";
import "../announcement/announcement.css";
import Announcebutton from "../../components/announceButton/announceButton";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5; // You can change the number of rows per page here

  useEffect(() => {
    // Fetch all announcements on component mount
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcement`);
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

      <div className="headers">
        <h2>Announcement</h2>

        <button className="Add" onClick={() => setShowModal(true)}>
          Add New Announcement
        </button>
      </div>

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
                <td className="AnnounceDescription">
                  {announcement.description}
                </td>
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
        
        {/* modal */}
        {showModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Add Announcement</h2>
              <form onSubmit={handleSubmit}>
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
               <div className="button-container">
                   <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>
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

export default Announcement;
