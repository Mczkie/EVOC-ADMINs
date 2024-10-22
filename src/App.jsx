import { BrowserRouter as Router, Route, Routes, BrowserRouter, } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/login-page';
import Dashboard from './pages/dashboard';
import Collection from './pages/collection';
import Announcement from './pages/announcement';
import Reports from './pages/reports';
import Dashboardcontent from './pages/dashboard-content';
import Users from './pages/users';


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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
