import React, { useState, useEffect } from "react";
import "../users/users.css";
import TableAction from "../../components/table-action";
import { FaUser, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";

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
      <div className="headers-user">
        <div>
          <h2 className="user-title">Add New Admin or Staff</h2>
          <p>Manage user accounts</p>
        </div>
        <button className="Add-new-stuff" onClick={() => setShowModal(true)}>
          <span className="icon-user">
            <FaUserPlus
              style={{
                color: "white",
                fill: "white",
              }}
              size={16}
            />
          </span>{" "}
          <p className="user-title-button">Add New</p>
        </button>
      </div>

      <section className="tableSection">
        <div className="table-users">
          <h1 className="user-list">User List </h1>
          <table className="user-table">
            <thead>
              <tr className="table-hero-header">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="user-role">{user.role}</span>
                    </td>
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
        </div>
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
          <div className="user-modalOverlay">
            <div className="user-modalContent">
              <h2>Add New Admin or Staff</h2>
              <p>Create a new user account and assign roles</p>

              <form
                className="user-NewUser"
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
                      "https://evoc-backend.onrender.com/api/admin",
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
                <div className="user-inputs">
                  <div className="inputs-email">
                    <label htmlFor="email">Email</label>
                    <input
                      className="user-input"
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>

                  {/* Password Field with Toggle */}
                  <div className="user-password">
                    <div className="password-user">
                      <label htmlFor="password">Password</label>
                      <input
                      className="password-input"
                        type={revealPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        id="password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRevealPassword(!revealPassword)}
                    className="user-eyeButton"
                  >
                    {revealPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="name-user">
                  <label htmlFor="name">Name</label>
                  <input
                  className="user-name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                />
                </div>

                <select name="role" className="roles" required>
                  <option value="">Select Role</option>
                  <option value="administrator">Administrator</option>
                  <option value="staff">Staff</option>
                </select>

                <div className="user-modalButtons">
                  <button type="submit" className="user-create">
                    Create User
                  </button>
                  <button
                    className="user-cancel"
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
