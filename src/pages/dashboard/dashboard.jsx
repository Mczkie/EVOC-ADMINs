import React from 'react'
import Sidebar from '../../model/sideBar';
import '../dashboard/dashboard.css';
import { Outlet } from 'react-router-dom';
// import Dashboardcontent from './dashboard-content';



function Dashboard() {
    return (
        <div className='Dashboard'>
            <Sidebar/>

            <div className='main-content'>
                <Outlet />
            </div>

        </div>

    );
};

export default Dashboard
