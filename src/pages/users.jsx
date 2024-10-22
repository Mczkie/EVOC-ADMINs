import React from 'react'
import '../styles/users.css';
import { useState } from 'react';
import { useEffect } from 'react';
import TableAction from '../components/table-action';


function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () =>{
      const response = await fetch("http://localhost:5000/api/users")
      const data = await response.json()
      // console.log(data.length)
      // console.log(data)
      setUsers(data)
    }
    fetchData()
  }, []);

  return (
    <div className='Table-container'>
        <table>
          <thead>
            <tr>
              <th>email</th>
              <th>Role</th>
              <th>Date log</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length && users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.time_stamp}</td>
                <td><TableAction userId={user.id}/></td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Users
