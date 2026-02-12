import React, { useEffect, useState } from "react";

export default function update() {
  const [showModal, setShowModal] = useState(false);
  return;
  {
    showModal && (
      <div className="modalOverlay">
        <div className="modalContent">
          <h2>Add New Collection Schedule</h2>
          {error && <p className="errorMessage">{error}</p>}
          {successMessage && <p className="successMessage">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="scheduleForm">
            <input
              ref={firstInputRef}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="inputField"
              list="locations"
              required
            />
            <datalist id="locations">
              <option value="East Bajac Bajac" />
              <option value="West Bajac Bajac" />
              <option value="Elicano" />
              <option value="Sta. Rita" />
              <option value="Gordon Heights" />
              <option value="Anonas St." />
            </datalist>
            {/* Streets */}
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street"
              className="inputField"
              list="streets"
              required
            />
            <datalist id="streets">
              <option value="Canda Street" />
              <option value="18th Street" />
              <option value="26th Street" />
              <option value="24th Street" />
              <option value="23rd Street" />
              <option value="25th Street" />
            </datalist>
            <input
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              className="inputField"
            />
            <div className="buttons">
              <button type="submit" className="submitButton">
                Add
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>

            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
          </form>
        </div>
      </div>
    );
  }
}
