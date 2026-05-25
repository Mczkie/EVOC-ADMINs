import React, { useEffect, useState } from "react";
import "./announcement.css";
import Announcebutton from "../../components/announceButton/announceButton";
import { FaEdit, FaTrash, FaBullhorn, FaEye } from "react-icons/fa";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5; // You can change the number of rows per page here

  useEffect(() => {
    // Fetch all announcements on component mount
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          "https://evoc-backend.onrender.com/api/announcement",
        );
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile); // NEW

    const response = await fetch(
      "https://evoc-backend.onrender.com/api/announcement",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    setAnnouncements((prev) => [...prev, data]);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(announcements.length / reportsPerPage);

  // Get current announcements based on pagination
  const indexOfLastAnnouncement = currentPage * reportsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - reportsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement,
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const handleEditClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditTitle(announcement.title);
    setEditDescription(announcement.description);
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://evoc-backend.onrender.com/api/announcement/${selectedAnnouncement.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update");

      const updated = await response.json();

      setAnnouncements((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );

      setEditModal(false);
      setSelectedAnnouncement(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "https://evoc-backend.onrender.com/api/announcement",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        },
      );

      if (!response.ok) throw new Error("Delete failed");

      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalAnnouncements = announcements.length;
  const publishedAnnouncements = announcements.length; // same for now
  const currentShowingStart = indexOfFirstAnnouncement + 1;
  const currentShowingEnd = Math.min(
    indexOfLastAnnouncement,
    totalAnnouncements,
  );

  return (
    <div className="contentWrapper">
      <div className="announcement-headers">
        <div className="">
          <h2 className="announecment-hero-title">Announcement</h2>
          <p className="announcement-hero-subtitle">
            Create and manage system announcements
          </p>
        </div>

        <button className="add-announcement" onClick={() => setShowModal(true)}>
          Add New Announcement
        </button>
      </div>

      <section className="card-header">
        <div className="card-hero">
          <div className="hero-box">
            <div className="total-container">
              <h3 className="total-title">Total Announcements</h3>
              <FaBullhorn
                className="hero-icon"
                color="#16a34a"
                fill="#16a34a"
              />
            </div>
            <p className="hero-number">{totalAnnouncements}</p>
          </div>

          <div className="hero-box">
            <div className="showing-container">
              <h3 className="showing-title">Showing</h3>
              <FaEye className="hero-icon" color="#3656e3" fill="#3656e3" />
            </div>
            <p className="hero-number">
              {currentShowingStart} <span className="outof">out of</span>{" "}
              {currentShowingEnd}
            </p>
          </div>
        </div>
      </section>

      <section className="announcement-table-section">
        <div className="announcement-table-container">
          <h1 className="upcoming-announcement">All Announcement</h1>
          {currentAnnouncements.map((announcement) => (
            <div className="announcement-card" key={announcement.id}>
              {/* Left: Barangay */}
              <div className="info-announcement">
                <h3>{announcement.title}</h3>

                <p>{announcement.description}</p>
                <small>
                  {formatDisplayDate(announcement.time_stamp)} •{" "}
                  {formatDisplayTime(
                    new Date(announcement.time_stamp)
                      .toTimeString()
                      .slice(0, 8),
                  )}
                </small>
                <div>
                  {announcement.image && (
                    <img
                      src={`https://evoc-backend.onrender.com${announcement.image}`}
                      alt="announcement"
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
              </div>
               {/* Right: optional status or actions */}
              <div className="status announcement">published</div>

              <div className="action-buttons">
                <button
                  onClick={() => handleEditClick(announcement)}
                  className="button-announcement-edit"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="button-announcement-trash"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-announcement-title">
                Create New Announcement
              </h2>
              <p className="modal-announcement-subtitle">
                Create an announcement to notify users
              </p>

              <form onSubmit={handleSubmit} className="modal-form">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  required
                />

                <label>Description</label>
                <textarea
                  className="modal-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description..."
                  required
                />

                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button type="submit">Publish</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(false)}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Edit Announcement</h2>

              <form onSubmit={handleUpdate} className="modal-form">
                <label>Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <label>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <div className="modal-actions">
                  <button type="button" onClick={() => setEditModal(false)}>
                    Cancel
                  </button>

                  <button type="submit">Update</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Announcement;
