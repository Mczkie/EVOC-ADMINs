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
                <h2>Dashboard</h2>
            </div>
            <hr />
            <ul>
                <li><span><FaHome/></span><Link to="/dashboard">Dashboard</Link></li>
                <li><span><FaUserCircle /></span><Link to="/dashboard/user">Users</Link></li>
                <li><span><FaCalendarAlt /></span><Link to="/dashboard/collection-schedule">Collection Schedule</Link></li>
                <li><span><FaBullhorn /></span><Link to="/dashboard/announcement">Announcement</Link></li>
                <li><span><FaFileAlt /></span><Link to="/dashboard/reports">Reports</Link></li>
            </ul>
            <div className='buttons'>
            <button onClick={handleLogout} className='buttonLogout'>Logout</button>
            </div>
        </div>
    );
}

export default Sidebar;
