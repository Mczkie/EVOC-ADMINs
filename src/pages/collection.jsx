// import React, { useEffect, useState } from 'react';
// // import '../styles/collectionSchedule.css';

// function Collection() {
//   const [schedules, setSchedules] = useState([]);
//   const [location, setLocation] = useState("");
//   const [collectionDate, setCollectionDate] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     // Fetch all collection schedules on component mount
//     fetch("http://localhost:5000/api/collectionschedule")
//       .then((response) => response.json())
//       .then((data) => setSchedules(data))
//       .catch((err) => console.error("Error fetching schedules:", err));
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMessage("");

//     if (!location || !collectionDate) {
//       setError("Location and Collection Date are required!");
//       return;
//     }

//     const newSchedule = { location, collection_date: collectionDate };

//     fetch("http://localhost:5000/api/newcollectionschedule", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newSchedule),
//     })
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error("Failed to create schedule");
//         }
//       })
//       .then((data) => {
//         setSuccessMessage("Schedule added successfully!");
//         setSchedules([...schedules, data]); // Add new schedule to state
//         setLocation("");
//         setCollectionDate("");
//       })
//       .catch((err) => setError("Error adding schedule"));
//   };

//   return (
//     <div className="scheduleWrapper">
//       <form onSubmit={handleSubmit} className="scheduleForm">
//         <h2 className="headingSche">Schedule</h2>

//         <input
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           placeholder="Location"
//           className="inputField"
//         />
//         <input
//           type="date"
//           value={collectionDate}
//           onChange={(e) => setCollectionDate(e.target.value)}
//           className="inputField"
//         />
//         <button type="submit" className="submitButton">Add</button>

//         {error && <p className="error">{error}</p>}
//         {successMessage && <p className="success">{successMessage}</p>}
//       </form>

//       <div className="scheduleCard">
//         <table>
//           <thead>
//             <tr>
//               <th>Location</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedules.map((schedule) => (
//               <tr key={schedule.id}>
//                 <td>{schedule.location}</td>
//                 <td>{new Date(schedule.collection_date).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>


//   );
// }

// export default Collection;

import React, { useEffect, useState } from 'react';
import '../styles/collection.css';

function Collection() {
  const [schedules, setSchedules] = useState([]);
  const [location, setLocation] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5; // You can adjust the number of schedules per page

  useEffect(() => {
    // Fetch all collection schedules on component mount
    fetch("http://localhost:5000/api/collectionschedule")
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

    fetch("http://localhost:5000/api/newcollectionschedule", {
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
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to create schedule");
          });
        }
      })
      .then((data) => {
        setSuccessMessage("Schedule added successfully!");
        setSchedules([...schedules, data]); // Add new schedule to state
        setLocation("");
        setCollectionDate("");
      })
      .catch((err) => setError(`Error adding schedule: ${err.message}`));
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(schedules.length / schedulesPerPage);

  // Get current schedules based on pagination
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      {currentSchedules.map((schedule) => (
        <tr key={schedule.id || `${schedule.location}-${schedule.collection_date}`}>
          <td>{schedule.location}</td>
          <td>{new Date(schedule.collection_date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination moved below the table inside the scheduleCard */}
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

export default Collection;

