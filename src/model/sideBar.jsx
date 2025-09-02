import React from 'react';
import '../styles/sideBar.css';
import '../styles/dashboard.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaUserCircle, FaCalendarAlt, FaBullhorn, FaFileAlt } from "react-icons/fa";


function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            localStorage.removeItem('authToken');
            navigate('/');
            alert('Successfully logout');
        }catch(error){
            console.error('Error during logout:', error);
            alert('An error occured during logout', error);
        }
    };

    return (
        <div className="Sidebar">
            <div className='title'>
                <h1>EVOC ADMIN</h1>
                <hr />
                <h2>Dashboard</h2>
            </div>
            <hr />
            <ul>
                <li><Link to="/dashboard"><span><FaHome/></span>Dashboard</Link></li>
                <li><Link to="/dashboard/user"><span><FaUserCircle /></span>Users</Link></li>
                <li><Link to="/dashboard/collection-schedule"><span><FaCalendarAlt /></span>Collection Schedule</Link></li>
                <li><Link to="/dashboard/announcement"><span><FaBullhorn /></span>Announcement</Link></li>
                <li><Link to="/dashboard/reports"><span><FaFileAlt /></span>Reports</Link></li>
            </ul>
            <div className='buttons'>
            <button onClick={handleLogout} className='buttonLogout'>Logout</button>
            </div>
        </div>
    );
}

export default Sidebar;
