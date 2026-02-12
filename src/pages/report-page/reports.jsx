import React, { useEffect, useState } from "react";
import "../report-page/report.css"
import ReportButton from "../../components/reportButton/reportButton";


function Reports() {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/reports");
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      setTitle("");
      setDescription("");
      setSuccessMessage("Report submitted successfully!");
      
      // Auto refresh list
      fetchReports();
      setCurrentPage(1); // optional: reset to first page
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Error submitting report");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // charts 

  

  return (
    <div className="wrapper">
      <div className="headers">
        <h1>Reports</h1>
        <button className="addReportButton" onClick={() => setShowModal(true)}>
          Add Report
        </button>
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Add New Report</h2>
            {error && <p className="errorMessage">{error}</p>}
            {successMessage && (
              <p className="successMessage">{successMessage}</p>
            )}
            <form className="formsidebar" onSubmit={handleSubmit}>
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
          <div className="buttons">
            <button type="submit">Submit</button>
            <button onClick={()=> setShowModal(false)}>Cancel</button>
          </div>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
            </div>
            </div>
            )}

      <div className="table-container">
        <div className="reportBody">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan="3">No reports available</td>
                </tr>
              ) : (
                currentReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.title}</td>
                    <td>{report.description}</td>
                    <td>
                      <ReportButton
                        id={report.id}
                        title={report.title}
                        setReports={setReports}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            
          </table>
          <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        </div>

      </div>
    </div>
  );
}

export default Reports;
