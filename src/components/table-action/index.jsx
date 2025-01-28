// import React, { useState } from 'react'


function TableAction({email, password}) {
  // const [userDelete, setUserDelete] = useState();

  const deleteButton = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/updateUser', {
          method: 'POST',
          headers: {
              'Content-type': 'application/json',
          },
          body: JSON.stringify({ email:email,status:"Deleted",password : password }),
      });
      console.log(response);
      if(response.ok){
        alert("User Deleted")
      }
   }catch(error) {
    console.error('Error deleting users:', error);
    alert('An occured during deleting users:'+ error);
  }
}

const restoreButton = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/updateUser', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ email:email,status:"Active",password : password }),
    });
    console.log(response);
    if(response.ok){
      alert("User Restored")
    }
 }catch(error) {
  console.error('Error restoring users:', error);
  alert('An occured during restoring users:'+ error);
}
}


  return (
    <div id="action-container">
      <button id="edit-btn">Edit</button>
      <button id="delete-btn" onClick={deleteButton}>Delete</button>
      <button id="restore-btn" onClick={restoreButton}>Restore</button>
    </div>
  )
}

export default TableAction
