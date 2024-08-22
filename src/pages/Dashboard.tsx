import React from 'react'
import { useUserContext } from '../context/UserContext';

const Dashboard = () => {


  const {logout}=useUserContext()

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard