import React, { useEffect, useState } from "react";
import Sidebar from "../../model/sideBar";
import "../dashboard/dashboard.css";
import { Outlet } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import EsmoLogo from "../../assets/esmo2.png";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);

        // only keep name + role
        setCurrentUser({
          name: parsedUser.name,
          role: parsedUser.role,
        });
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="Dashboard">
      <Sidebar />

      <div className="main-content">
        <nav className="nav-bar">
          <div className="nav-content">
            <img src={EsmoLogo} alt="Esmo Logo" height="50" width="50" />
            <div className="nav-hero">
              <FaUserCircle size={30} color="#65B741" fill="#65B741" />
              <div>
                <h1 className="nav-user">{currentUser?.name || "Guest"}</h1>
                <p className="nav-user">{currentUser?.role || "No role"}</p>
              </div>
            </div>
          </div>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
