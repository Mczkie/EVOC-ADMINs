import React from "react";
import "./barangay-style.css";
import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarked,
  FaUser,
  FaUsers,
  FaCar,
  FaPen,
  FaSave,
} from "react-icons/fa";

function Barangay() {
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Details");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newBarangay, setNewBarangay] = useState({
    name: "",
    captain: "",
    population: "",
    households: "",
    area: "",
    address: "",
    collectors: "",
    vehicles: "",
    phone: "",
    email: "",
  });

  const handleAddBarangay = async () => {
    try {
      const res = await fetch(
        "https://evoc-backend.onrender.com/api/barangay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBarangay),
        },
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Create failed:", err);
        return;
      }

      const created = await res.json();

      setBarangays((prev) => [created, ...prev]);
      setSelectedBarangay(created);

      setShowModal(false);
      setNewBarangay({
        name: "",
        captain: "",
        population: "",
        households: "",
        area: "",
        address: "",
        collectors: "",
        vehicles: "",
        phone: "",
        email: "",
      });

      setIsEditing(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedBarangay?.id) {
      console.error("No barangay selected");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ${selectedBarangay.name}? This cannot be undone.`,
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://evoc-backend.onrender.com/api/barangay/${selectedBarangay.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Delete failed:", err);
        return;
      }

      // remove from UI
      const updatedList = barangays.filter((b) => b.id !== selectedBarangay.id);

      setBarangays(updatedList);

      // auto-select next barangay
      setSelectedBarangay(updatedList[0] || null);

      console.log("Barangay deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const emptyBarangay = {
    name: "",
    captain: "",
    population: 0,
    households: 0,
    area: "",
    address: "",
    collectors: 0,
    vehicles: 0,
    phone: "",
    email: "",
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(
        "https://evoc-backend.onrender.com/api/barangay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emptyBarangay),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Create failed:", errorText);
        return;
      }

      const newBarangay = await res.json();

      setBarangays((prev) => [newBarangay, ...prev]); // put on top
      setSelectedBarangay(newBarangay); // auto select NEW
      setIsEditing(true); // allow editing immediately
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://evoc-backend.onrender.com/api/barangay",
        );
        const data = await res.json();
        console.log("BARANGAYS FROM API:", data);

        setBarangays(data);

        if (data?.length > 0) {
          setSelectedBarangay(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!selectedBarangay?.id) {
      console.error("No barangay selected yet");
      return;
    }

    const res = await fetch(
      `https://evoc-backend.onrender.com/api/barangay/${selectedBarangay.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBarangay),
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Save failed:", errorText);
      return;
    }

    const updated = await res.json();
    console.log("SAVE CLICKED");
    console.log("Selected Barangay:", selectedBarangay);

    setBarangays((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b)),
    );

    setSelectedBarangay(updated);
    setIsEditing(false);
  };

  return (
    <div className="barangay-body">
      <section className="barangay-section">
        <div className="barangay-hero-header">
          <h1 className="barangay-title">Barangay Profile</h1>
          <p className="barangay-subtitle">
            Manage barangay information and settings
          </p>
        </div>
        <div className="barangay-edit-container">
          <div
            className={`barangay-edit-button ${isEditing ? "active" : ""}`}
            onClick={() => {
              if (isEditing) {
                handleSave(); // SAVE when editing
              } else {
                setIsEditing(true); // ENABLE EDIT MODE
              }
            }}
          >
            {isEditing ? (
              <>
                <FaSave fill="white" />
                Save Changes
              </>
            ) : (
              <>
                <FaPen fill="white" />
                Edit Profile
              </>
            )}
          </div>

          <div
            className="barangay-add-button"
            onClick={() => setShowModal(true)}
          >
            + Add Barangay
          </div>
        </div>
      </section>

      <section className="nav-container">
        <div className="barangay-nav-route">
          <h1 className="barangay-list-title">Barangay List</h1>

          {loading ? (
            <p>Loading barangays...</p>
          ) : barangays.length === 0 ? (
            <p>No barangays found.</p>
          ) : (
            <div className="barangay-nav-link">
              {barangays.map((b) => (
                <div
                  key={b.id}
                  className={`barangay-card ${
                    selectedBarangay?.id === b.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedBarangay(b);
                    setIsEditing(false); // important UX fix
                  }}
                >
                  <div className="icon-box">
                    <FaBuilding fill="#00a63e" />
                  </div>

                  <div className="barangay-text">
                    <h3>{b.name}</h3>
                    <p>{b.captain || "No captain assigned"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="barangay-header">
          <div className="barangay-info-container">
            <div className="barangay-info-cards">
              <div className="info-cards">
                <div>
                  <h2>Population</h2>
                  <p>{selectedBarangay?.population || 0}</p>
                </div>
                <FaUsers size={30} color="#00a63e" fill="#00a63e" />
              </div>
              <div className="info-cards">
                <div>
                  <h2>Households</h2>
                  <p>{selectedBarangay?.households || 0}</p>
                </div>
                <FaBuilding size={30} fill="blue" />
              </div>
              <div className="info-cards">
                <div>
                  <h2>Collectors</h2>
                  <p>{selectedBarangay?.collectors || 0}</p>
                </div>
                <FaUser size={30} fill="red" />
              </div>

              <div className="info-cards">
                <div>
                  <h2>Vehicles</h2>
                  <p>{selectedBarangay?.vehicles || 0}</p>
                </div>
                <FaCar size={30} fill="blue" />
              </div>
            </div>
          </div>

          <div className="details-collection-contacts-container">
            <div className="details-collection-container">
              <button
                onClick={() => setSelectedTab("Details")}
                className={`details-button ${selectedTab === "Details" ? "active" : ""}`}
              >
                Details
              </button>

              <button
                onClick={() => setSelectedTab("Collection Info")}
                className={`details-button ${selectedTab === "Collection Info" ? "active" : ""}`}
              >
                Collection Info
              </button>

              <button
                onClick={() => setSelectedTab("Contact")}
                className={`details-button ${selectedTab === "Contact" ? "active" : ""}`}
              >
                Contact
              </button>
            </div>
          </div>

          <div className="details-container">
            {selectedTab === "Details" && (
              <div>
                <h2 className="details-titles">{selectedBarangay?.name}</h2>
                <div className="details-form-container">
                  <form className="details-card">
                    <div className="details-form-cards">
                      <label htmlFor="">Barangay Name</label>
                      <input
                        type="text"
                        value={selectedBarangay?.name || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSelectedBarangay({
                            ...selectedBarangay,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="details-form-cards">
                      <label htmlFor="">Barangay Captain</label>
                      <input
                        type="text"
                        value={selectedBarangay?.captain || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSelectedBarangay({
                            ...selectedBarangay,
                            captain: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="details-form-cards">
                      <label htmlFor="">Population</label>
                      <input
                        type="text"
                        value={selectedBarangay?.population || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSelectedBarangay({
                            ...selectedBarangay,
                            population: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="details-form-cards">
                      <label htmlFor="">Household</label>
                      <input
                        type="text"
                        value={selectedBarangay?.households || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSelectedBarangay({
                            ...selectedBarangay,
                            households: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="details-form-cards">
                      <label htmlFor="">Area</label>
                      <input
                        type="text"
                        value={selectedBarangay?.area || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSelectedBarangay({
                            ...selectedBarangay,
                            area: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="details-form-cards">
                      <label htmlFor="">Address</label>
                      <input
                        type="text"
                        value={selectedBarangay?.address || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSelectedBarangay({
                            ...selectedBarangay,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  <div className="barangay-actions">
                    <div
                      className="barangay-delete-button"
                      onClick={handleDelete}
                    >
                      Delete Barangay
                    </div>
                  </div>
                  </form>
                </div>
              </div>
            )}

            {selectedTab === "Collection Info" && (
              <div>
                <h2 className="details-titles">
                  Collection Schedules & Resources
                </h2>
                <div className="collection-days">
                  <h2 className="collection-days-title">Collection Days</h2>
                  <div className="Days-container">
                    <div className="Days-card">
                      <h2 className="Monday">Monday</h2>
                    </div>
                    <div className="Days-card">
                      <h2 className="Monday">Thursday</h2>
                    </div>
                  </div>
                  <div className="collection-form">
                    <form action="#" className="collection-cards">
                      <div className="collcetion-form-container">
                        <label htmlFor="">Number of Collectors</label>
                        <input
                          value={selectedBarangay?.collectors}
                          type="number"
                          name="collector"
                          id="collector"
                          disabled={!isEditing}
                          onChange={(e) =>
                            setSelectedBarangay({
                              ...selectedBarangay,
                              collectors: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="collcetion-form-container">
                        <label htmlFor="">Number of Vehicles</label>
                        <input
                          value={selectedBarangay?.vehicles}
                          type="number"
                          name="vehicle"
                          id="vehicle"
                          disabled={!isEditing}
                          onChange={(e) =>
                            setSelectedBarangay({
                              ...selectedBarangay,
                              vehicles: e.target.value,
                            })
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "Contact" && (
              <div>
                <h2 className="details-titles">Contact Information</h2>
                <div className="contact-forms">
                  <form action="#">
                    <div className="contact-container">
                      <label htmlFor="">Contact number</label>
                      <div className="telephone">
                        <FaPhone fill="#6b7280" />{" "}
                        <input
                          value={selectedBarangay?.phone || ""}
                          type="tel"
                          name="phone"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          placeholder="+63 912 345 6789"
                          disabled={!isEditing}
                          required
                          onChange={(e) =>
                            setSelectedBarangay({
                              ...selectedBarangay,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="contact-container">
                      <label htmlFor="">Email</label>
                      <div className="telephone">
                        <FaEnvelope fill="#6b7280" />{" "}
                        <input
                          value={selectedBarangay?.email || ""}
                          type="email"
                          name="email"
                          placeholder="sample@gmail.com"
                          disabled={!isEditing}
                          required
                          onChange={(e) =>
                            setSelectedBarangay({
                              ...selectedBarangay,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="contact-container">
                      <label htmlFor="">Office Address</label>
                      <div className="telephone">
                        <FaMapMarked fill="#6b7280" />{" "}
                        <input
                          value={selectedBarangay?.address || ""}
                          type="text"
                          name="full_address"
                          placeholder="Address..."
                          disabled={!isEditing}
                          required
                          onChange={(e) =>
                            setSelectedBarangay({
                              ...selectedBarangay,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </form>
                  <hr />
                  <div className="emergency-header">
                    <h1>Emergency Contacts</h1>
                    <div className="emergency-card">
                      <div className="emegency-description">
                        <div className="emergency-title">
                          <h2>Barangay Hall</h2>
                          <p>Main Office</p>
                        </div>

                        <div className="emergency-hotline">
                          <h2>{selectedBarangay.phone}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="emergency-card">
                      <div className="emegency-description">
                        <div className="emergency-title">
                          <h2>Collection Supervisor</h2>
                          <p>Operations</p>
                        </div>

                        <div className="emergency-hotline">
                          <h2>(047) 224 9346</h2>
                        </div>
                      </div>
                    </div>
                    <div className="emergency-card">
                      <div className="emegency-description">
                        <div className="emergency-title">
                          <h2>Emergency Hotline</h2>
                          <p>24/7</p>
                        </div>

                        <div className="emergency-hotline">
                          <h2>#911</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Barangay</h2>

            <div className="modal-grid">
              <input
                placeholder="Barangay Name"
                value={newBarangay.name}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, name: e.target.value })
                }
              />

              <input
                placeholder="Captain"
                value={newBarangay.captain}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, captain: e.target.value })
                }
              />

              <input
                placeholder="Population"
                type="number"
                value={newBarangay.population}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, population: e.target.value })
                }
              />

              <input
                placeholder="Households"
                type="number"
                value={newBarangay.households}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, households: e.target.value })
                }
              />

              <input
                placeholder="Area"
                value={newBarangay.area}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, area: e.target.value })
                }
              />

              <input
                placeholder="Address"
                value={newBarangay.address}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, address: e.target.value })
                }
              />

              <input
                placeholder="Collectors"
                type="number"
                value={newBarangay.collectors}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, collectors: e.target.value })
                }
              />

              <input
                placeholder="Vehicles"
                type="number"
                value={newBarangay.vehicles}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, vehicles: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                value={newBarangay.phone}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, phone: e.target.value })
                }
              />

              <input
                placeholder="Email"
                value={newBarangay.email}
                onChange={(e) =>
                  setNewBarangay({ ...newBarangay, email: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={handleAddBarangay}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Barangay;
