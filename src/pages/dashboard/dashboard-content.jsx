import React, { useEffect, useState } from 'react';
import '../dashboard/dashContent.css';
import DashboardChart from '../../components/chart/chart';

function DashboardContent() {
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL; // <- Your backend URL from .env

        // Fetch all endpoints in parallel
        const [userRes, reportsRes, announcementRes, collectionRes, mobileUserRes] =
          await Promise.all([
            fetch(`${API_URL}/users`),
            fetch(`${API_URL}/reports`),
            fetch(`${API_URL}/announcement`),
            fetch(`${API_URL}/collection`),
            fetch(`${API_URL}/mobileuser`),
          ]);

        // Check for errors
        if (!userRes.ok) throw new Error('Failed to fetch users');
        if (!reportsRes.ok) throw new Error('Failed to fetch reports');
        if (!announcementRes.ok) throw new Error('Failed to fetch announcements');
        if (!collectionRes.ok) throw new Error('Failed to fetch collections');
        if (!mobileUserRes.ok) throw new Error('Failed to fetch mobile users');

        // Parse JSON
        const [users, reports, announcements, collections, mobileUsers] =
          await Promise.all([
            userRes.json(),
            reportsRes.json(),
            announcementRes.json(),
            collectionRes.json(),
            mobileUserRes.json(),
          ]);

        // Update widgets state
        setWidgets([
          { title: 'Users', count: users.length },
          { title: 'Announcements', count: announcements.length },
          { title: 'Collections', count: collections.length },
          { title: 'Mobile Users', count: mobileUsers.length },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);

        // Fallback dummy data so dashboard still shows
        setWidgets([
          { title: 'Users', count: 0 },
          { title: 'Announcements', count: 0 },
          { title: 'Collections', count: 0 },
          { title: 'Mobile Users', count: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      {error && <p className="error-message">Error: {error}</p>}

      <div className="widgetContainer">
        {loading ? (
          <p>Loading...</p>
        ) : (
          widgets.map((item, idx) => (
            <div key={idx} className="contentContainer">
              <h1>{item.title}</h1>
              <h2>{item.count}</h2>
            </div>
          ))
        )}
      </div>

      {!loading && widgets.length > 0 && (
        <section className="chartSection">
          <div className="chartContainer">
            <DashboardChart
              labels={widgets.map((w) => w.title)}
              data={widgets.map((w) => w.count)}
              chartTitle="System Analytics Overview"
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardContent;
