import React, { useEffect, useState } from "react";

function MobileUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ fetchData function
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://evoc-backends.onrender.com/api/mobileuser");
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect to run once and optionally auto reload
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData(); // auto reload every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mobile Users</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MobileUsers;