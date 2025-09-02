function AnnouncementButton({ id, setAnnouncements }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch("http://localhost:5001/api/announcement", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Remove from local state so table updates immediately
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        console.log({ id, status: "Deleted" });
      } else {
        console.error("Failed to delete announcement");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}

export default AnnouncementButton;
