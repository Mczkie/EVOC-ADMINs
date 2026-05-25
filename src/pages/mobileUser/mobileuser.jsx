import React, { useEffect, useState } from "react";
import "../mobileUser/mobileuser.css";

function MobileUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://evoc-backend.onrender.com/api/mobile-users"
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();

      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 50000);

    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;

  const currentUsers = users.slice(
    indexOfFirst,
    indexOfLast
  );

  if (loading)
    return <p className="loading">Loading users...</p>;

  if (error)
    return <p className="error">{error}</p>;

  return (
    <div className="mobileUsers">

      <div className="mobileUsers-header">
        <div>
          <h1>Mobile Users</h1>
          <p>Manage mobile user accounts</p>
        </div>
      </div>

      <div className="mobileUsers-card">

        <h2>User List</h2>

        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>ROLE</th>
              <th>LOCATION</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="3">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>

                  <td>
                    <span className="roleBadge">
                      {user.role}
                    </span>
                  </td>

                  <td>{user.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(prev => prev - 1)
            }
          >
            Previous
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(prev => prev + 1)
            }
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
}

export default MobileUsers;