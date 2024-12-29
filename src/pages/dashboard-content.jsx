import { useEffect, useState } from 'react';
import '../styles/dashContent.css';

function DashboardContent() {
  const [userCount, setUserCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, reportsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/users"),
          fetch("http://localhost:5000/api/reports"),
        ]);

        // Error handling for responses
        if (!userResponse.ok) {
          const userError = await userResponse.text();
          throw new Error(`Failed to fetch users: ${userError}`);
        }
        if (!reportsResponse.ok) {
          const reportsError = await reportsResponse.text();
          throw new Error(`Failed to fetch reports: ${reportsError}`);
        }

        const userData = await userResponse.json();
        const reportsData = await reportsResponse.json();

        setUserCount(userData.length);
        setReportsCount(reportsData.length);

        setWidgets([
          { title: 'Users', count: userData.length },
          { title: 'Reports', count: reportsData.length },
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.message); // Set error message
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : widgets.length ? (
        widgets.map((item, index) => (
          <div key={index} className="contentContainer">
            <h1>{item.title}</h1>
            <h2>{item.count}</h2>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DashboardContent;
