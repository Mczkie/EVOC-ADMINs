import React from "react";

function TableAction({ id, email, password, setUsers }) {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const response = await fetch("http://localhost:5001/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Remove user from parent state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        console.log(`User ${email} deleted successfully`);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div id="action-container">
      <button id="delete-btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

export default TableAction;
