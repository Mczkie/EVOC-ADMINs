import React from "react";

function ReportButton({ id, title, setReports }) {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch("http://localhost:5001/api/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Remove report from parent state immediately
        setReports(prevReports => prevReports.filter(report => report.id !== id));
        console.log({ title, status: 'Deleted' });
      } else {
        console.error("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <button id="delete-btn" onClick={handleDelete}>
      Delete
    </button>
  );
}

export default ReportButton;
