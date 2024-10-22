import React, { useEffect, useState } from 'react';
import '../styles/report.css';

function Reports() {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 
    setSuccessMessage(""); 

    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }
    
    const newReport = { title, description };
    fetch("http://localhost:5000/api/newreports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReport),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create report");
        }
      })
      .then((data) => {
        setSuccessMessage("Report submitted successfully!");
        setReports([...reports, data]); // Add new reports to state
        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        console.error("Error submitting report", err);
        setError("Error submitting report");
      });
  };

  return (
    <div className='reportBody'>
      <div className="reportTitle">
        <h1>REPORT</h1>
      </div>

      <form onSubmit={handleSubmit}>
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

      <div className="table-container">
        <h2>Submitted Reports</h2>
        {reports.length === 0 ? (
          <p>No reports available</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report">
              <h3>{report.title}</h3>
              <p>{report.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reports;
