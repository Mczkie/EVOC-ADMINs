
import React, { useEffect, useState } from 'react';
import '../styles/report.css';

function Reports() {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  // Calculate total number of pages
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  // Fetch reports from the server when the component mounts
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports");
      }
    };

    fetchReports();
  }, []);

  // Handle form submission to create a new report
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }

    const newReport = { title, description };

    try {
      const response = await fetch("http://localhost:5000/api/newreports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      const data = await response.json();
      setReports((prevReports) => [...prevReports, data]);
      setTitle("");
      setDescription("");
      setSuccessMessage("Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Error submitting report");
    }
  };

  // Get current reports based on pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <form className="formsidebar"  onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Report Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Report Description"
          />
          <button type="submit">Submit</button>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
      </div>

      <div className="table-container">
        <div className="reportBody">
          {currentReports.length === 0 ? (
            <p>No reports available</p>
          ) : (
            currentReports.map((report) => (
              <div key={report.id} className="report">
                <h3>{report.title}</h3>
                <p>{report.description}</p>
              </div>
            ))
          )}
        </div>

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

export default Reports;


