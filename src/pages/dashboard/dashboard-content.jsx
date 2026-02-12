import { useEffect, useState } from 'react';
import '../dashboard/dashContent.css'
import DashboardChart from '../../components/chart/chart';
import Report from '../report-page/reports.jsx';
import Collection from '../collection/collection.jsx';
import Announcement from '../announcement/announcement.jsx';
import Users from '../users/users.jsx';


function DashboardContent() {
  // const [userCount, setUserCount] = useState(0);
  // const [reportsCount, setReportsCount] = useState(0);
  // const [announcementCount, setAnnouncementCount] = useState(0);
  // const [collectionCount, setCollectionCount] = useState(0);
  // const [mobileUserCount, setMobileUserCount] = useState(0);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, reportsResponse, announcementResponse, collectionResponse, mobileUserResponse] = await Promise.all([
          fetch("http://localhost:5001/api/users"),
          fetch("http://localhost:5001/api/reports"),
          fetch("http://localhost:5001/api/announcement"),
          fetch("http://localhost:5001/api/collection"),
          fetch("http://localhost:5001/api/mobileuser"),
        ]);

        if (!userResponse.ok) throw new Error("Failed to fetch users");
        if (!reportsResponse.ok) throw new Error("Failed to fetch reports");
        if (!announcementResponse.ok) throw new Error("Failed to fetch announcements");
        if (!collectionResponse.ok) throw new Error("Failed to fetch collections");
        if(!mobileUserResponse.ok) throw new Error("Failed to fetch mobile users");

        const userData = await userResponse.json();
        const reportsData = await reportsResponse.json();
        const announcementData = await announcementResponse.json();
        const collectionData = await collectionResponse.json();
        const mobileUserData = await mobileUserResponse.json();

        setUserCount(userData.length);
        setReportsCount(reportsData.length);
        setAnnouncementCount(announcementData.length);
        setCollectionCount(collectionData.length);

        setWidgets([
          { title: 'Users', count: userData.length },
          { title: 'Announcements', count: announcementData.length },
          { title: 'Collections', count: collectionData.length },
          { title: 'Mobile Users', count: mobileUserData.length }
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      {error && <p className="error-message">Error: {error}</p>}

      <div className="widgetContainer">
        {widgets.length ? widgets.map((item, index) => (
          <div key={index} className="contentContainer">
            <h1>{item.title}</h1>
            <h2>{item.count}</h2>
          </div>
        )) : <p>Loading...</p>}
      </div>

      <section className='chartSection'>
        {widgets.length > 0 && (
        <div className="chartContainer">
          <DashboardChart
            labels={widgets.map(w => w.title)}
            data={widgets.map(w => w.count)}
            chartTitle="System Analytics Overview"
          />
        </div>
      )}
      </section>
    </div>
  );
}

export default DashboardContent;
