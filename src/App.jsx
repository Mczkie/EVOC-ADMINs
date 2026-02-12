import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Pages
import LoginPage from './pages/login-page/login-page';
import Dashboard from './pages/dashboard/dashboard';
import Collection from './pages/collection/collection';
import Announcement from './pages/announcement/announcement';
import Reports from './pages/report-page/reports';
import Dashboardcontent from './pages/dashboard/dashboard-content';
import MobileUsers from './pages/mobileUser/mobileuser';
import Users from './pages/users/users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />  

        {/* Nested Routes for Sidebar */}
        <Route path='/dashboard' element={<Dashboard />}>
          <Route index element={<Dashboardcontent />} />
          <Route path='user' element={<Users />} />
          <Route path='collection-schedule' element={<Collection />} />
          <Route path='announcement' element={<Announcement />} />
          <Route path='reports' element={<Reports />} />
          <Route path='mobile-users' element={<MobileUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
