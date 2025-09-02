import React from "react";


function CollectionButton({ id, location, setCollection }) {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${location}"?`)) return;

    try {
      const response = await fetch("http://localhost:5001/api/collection", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Remove report from parent state immediately
        setCollection(prevCollection  => prevCollection.filter(collection => collection.id !== id));
        console.log({ location, status: 'Deleted' });
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

export default CollectionButton;
