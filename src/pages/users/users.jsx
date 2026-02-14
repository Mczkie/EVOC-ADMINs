import React, { useState, useEffect } from "react";
import "../users/users.css";
import TableAction from "../../components/table-action";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/users");
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
              {message && <p className="message">{message}</p>}
              <form
                className="NewUser"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newUser = {
                    email: formData.get("email"),
                    password: formData.get("password"),
                    role: formData.get("role"),
                    name: formData.get("name"),
                  };
                  try {
                    const response = await fetch(
                      "http://localhost:5001/api/admin",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                      }
                    );

                    if (!response.ok) {
                      setMessage("New Admin or Staff failed to add!");
                    } else {
                      setMessage("New Admin or Staff added successfully!");
                    }

                    const addedUser = await response.json();
                    setUsers((prevUsers) => [...prevUsers, addedUser]);
                    e.target.reset(); // Clear the form
                  } catch (error) {
                    console.error("Error adding user:", error);
                  }
                }}
              >
                
                <input type="email" name="email" placeholder="Email" required />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <input type="text" name="name" placeholder="Name" required />
                <select name="role" className="roles" required>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
                <div className="modalButtons">
                  <button type="submit">
                  Add User
                </button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
                {message && <p>{message}</p>}
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Users;
