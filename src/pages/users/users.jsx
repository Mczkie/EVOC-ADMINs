import React, { useState, useEffect } from "react";
import "../users/users.css";
import TableAction from "../../components/table-action";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [revealPassword, setRevealPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const usersPerPage = 5;

  const handleCheckboxChange = () => {
    setRevealPassword(!revealPassword);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://evoc-backend.onrender.com/api/users",
      );
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination
  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="Table-container">
      <div className="headers">
        <h2>Add New Admin or Staff</h2>
        <button className="Add" onClick={() => setShowModal(true)}>
          Add New Admin or Staff
        </button>
      </div>

      <section className="tableSection">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.name}</td>
                  <td>
                    <TableAction
                      id={user.id}
                      email={user.email}
                      password={user.password}
                      setUsers={setUsers}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="paginationuser">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="paginationbutton"
          >
            Previous
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="paginationbutton"
          >
            Next
          </button>
        </div>

        {showModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Add New Admin or Staff</h2>

              <form
                className="NewUser"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMessage("");

                  const formData = new FormData(e.target);
                  const newUser = {
                    email: formData.get("email"),
                    password: formData.get("password"),
                    role: formData.get("role"),
                    name: formData.get("name"),
                  };

                  try {
                    const response = await fetch(
                      "https://evoc-backends.onrender.com/api/admin",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                      },
                    );

                    const addedUser = await response.json();

                    if (!response.ok) {
                      setMessage("New Admin or Staff failed to add!");
                      return;
                    }

                    await fetchData(); // 🔥 reload users from database
                    setMessage("New Admin or Staff added successfully!");
                    e.target.reset();
                    setRevealPassword(false);
                    setShowModal(false);
                  } catch (error) {
                    console.error("Error adding user:", error);
                    setMessage("Server error. Please try again.");
                  }
                }}
              >
                <input type="email" name="email" placeholder="Email" required />

                {/* Password Field with Toggle */}
                <div className="passwordField">
                  <input
                    type={revealPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setRevealPassword(!revealPassword)}
                    className="eyeButton"
                  >
                    {revealPassword ? "🙈" : "👁"}
                  </button>
                </div>

                <input type="text" name="name" placeholder="Name" required />

                <select name="role" className="roles" required>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>

                <div className="modalButtons">
                  <button type="submit">Add User</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setMessage("");
                      setRevealPassword(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>

                {message && <p className="message">{message}</p>}
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Users;
