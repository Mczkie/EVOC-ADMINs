import { useEffect, useState } from 'react';
import '../styles/dashContent.css';

function Dashboardcontent() {
  const [userCount, setUserCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null); // New error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, reportsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/users"),
          fetch("http://localhost:5000/api/reports"),
        ]);
    
        // Check if any response is not okay
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
    
        const updatedContent = [
          { title: 'Users', count: userData.length },
          { title: 'Reports', count: reportsData.length },
        ];
    
        setWidgets(updatedContent);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.message); // Set the error message
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container'>
      {error ? ( // Display error if present
        <p>Error: {error}</p>
      ) : widgets.length ? (
        widgets.map((item, index) => (
          <div key={index} className="contentContainer">
            <h1>{item.title}</h1>
            <h1>{item.count}</h1>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboardcontent;
