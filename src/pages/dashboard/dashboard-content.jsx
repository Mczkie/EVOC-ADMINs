import { useEffect, useState } from "react";
import "../dashboard/dashContent.css";
import DashboardChart from "../../components/chart/chart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  FaUser,
  FaFileAlt,
  FaChartBar,
  FaCalendarAlt,
  FaMobileAlt,
  FaBuilding,
} from "react-icons/fa";

function DashboardContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentCollections, setRecentCollections] = useState([]);

  useEffect(() => {
    // ✅ Load logged-in user from localStorage
    const storedUser = localStorage.getItem("user");

    console.log("DEBUG USER:", storedUser); // 🔥 check this

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Invalid user data in localStorage");
      }
    }

    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const [
          userResponse,
          reportsResponse,
          announcementResponse,
          collectionResponse,
          barangayResponse,
        ] = await Promise.all([
          fetch("https://evoc-backend.onrender.com/api/users"),
          fetch("https://evoc-backend.onrender.com/api/reports"),
          fetch("https://evoc-backend.onrender.com/api/announcement"),
          fetch("https://evoc-backend.onrender.com/api/fixedschedule"),
          fetch("https://evoc-backend.onrender.com/api/barangay"),
        ]);

        if (!userResponse.ok) throw new Error("Failed to fetch users");
        if (!reportsResponse.ok) throw new Error("Failed to fetch reports");
        if (!announcementResponse.ok)
          throw new Error("Failed to fetch announcements");
        if (!collectionResponse.ok)
          throw new Error("Failed to fetch collections");
        if (!barangayResponse.ok) throw new Error("Failed to fetch barangay");

        const userData = await userResponse.json();
        const reportsData = await reportsResponse.json();
        const announcementData = await announcementResponse.json();
        const collectionData = await collectionResponse.json();
        const barangayData = await barangayResponse.json();

        // Get latest 5 announcements
        const latestAnnouncements = [...announcementData].slice(-5).reverse();

        // Get latest 5 collections
        const latestCollections = [...collectionData].slice(-5).reverse();

        setRecentAnnouncements(latestAnnouncements);
        setRecentCollections(latestCollections);

        console.log("Recent Announcements:", latestAnnouncements);
        console.log("Recent Collections:", latestCollections);

        setWidgets([
          {
            title: "Total Admin",
            count: userData.length,
            icons: <FaUser size={20} color="#4F46E5" fill="#4F46E5" />, // indigo
          },
          {
            title: "Announcements",
            count: announcementData.length,
            icons: <FaChartBar size={20} color="#10B981" fill="#10B981" />, // green
          },
          {
            title: "Collections",
            count: collectionData.length,
            icons: <FaCalendarAlt size={20} color="#F59E0B" fill="#F59E0B" />, // yellow/orange
          },
          {
            title: "Barangays",
            count: barangayData.length,
            icons: <FaBuilding size={20} color="#00a63e" fill="#00a63e" />,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const data = [
    { name: "Biodegradable", value: 40 },
    { name: "Recyclable", value: 30 },
    { name: "Residual", value: 20 },
  ];

  const COLORS = ["#4CAF50", "#2196F3", "#FF9800"];

  return (
    <div className="container">
      <section className="hero-headers">
        <h1 className="header-title">Dashboard Overview</h1>
        <p className="header-paragraph">
          Welcome back, {currentUser?.role || "Admin"}! Here's what's happening
          today.
        </p>
      </section>

      {error && <p className="error-message">Error: {error}</p>}

      <section className="widgetContainer">
        {widgets.length ? (
          widgets.map((item, index) => (
            <div key={index} className="contentContainer">
              <div className="hero-title">
                <h1 className="titles">{item.title}</h1>
                <div className="hero-icons">{item.icons}</div>
              </div>
              <h2 className="counts">{item.count}</h2>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </section>

      <div className="hero-charts">
        <section className="chartSection">
          {widgets.length > 0 && (
            <div className="chartContainer">
              <DashboardChart
                labels={widgets.map((w) => w.title)}
                data={widgets.map((w) => w.count)}
                chartTitle="System Analytics Overview"
              />
            </div>
          )}
        </section>

        <section className="chart-container">
          <h2>Waste Type Distribution</h2>

          <ResponsiveContainer width="100%" height={305}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="recent-section">
        <div className="recent-card">
          <h2>New Announcements</h2>

          {recentAnnouncements.length > 0 ? (
            recentAnnouncements.map((item) => (
              <div key={item.id} className="recent-item">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))
          ) : (
            <p>No announcements</p>
          )}
        </div>

        <div className="recent-card">
          <h2>New Collections</h2>

          {recentCollections.length > 0 ? (
            recentCollections.map((item) => (
              <div key={item.id} className="recent-item">
                <h4>{item.barangay}</h4>
                <p>{item.schedule}</p>
              </div>
            ))
          ) : (
            <p>No collections</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
