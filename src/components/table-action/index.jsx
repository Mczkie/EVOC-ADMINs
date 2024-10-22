import React, { useState } from 'react'


function TableAction({userId}) {
  const [userDelete, setUserDelete] = useState();

  const deleteButton = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
          method: 'DELETE',
          headers: {
              'Content-type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
      });
      if(response.ok){
        alert("User Deleted")
      }
   }catch(error) {
    console.error('Error deleting users:', error);
    alert('An occured during deleting users:${error.message}');
  }
}


  return (
    <div id="action-container">
      <button id="edit-btn">Edit</button>
      <button id="delete-btn" onClick={deleteButton}>Delete</button>
    </div>
  )
}

export default TableAction
