import React from "react";
import "../collectionButton/collectionButton.css";

function CollectionButton({
  id,
  location,
  street,
  date,
  setCollection,
  onUpdate,
}) {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${location}"?`))
      return;

    try {
      const response = await fetch("http://localhost:5001/api/collection", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setCollection((prevCollection) =>
          prevCollection.filter((collection) => collection.id !== id)
        );
        console.log({ location, status: "Deleted" });
      } else {
        console.error("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className="container">
      <button id="delete-btn" onClick={handleDelete}>
        Delete
      </button>

      <button
        id="delete-btn"
        onClick={() => onUpdate(id, location, street, date)}
      >
        Update
      </button>
    </div>
  );
}

export default CollectionButton;
