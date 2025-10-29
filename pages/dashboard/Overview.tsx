import React, { useEffect } from 'react';
import './dashboard.css';
import { mockConversations } from '../../src/mockDashboardData';

const Overview: React.FC = () => {
  const totalConversations = mockConversations.length;
  const appointmentsBooked = mockConversations.filter(conv => conv.hasAppointment).length;
  const callsScheduled = mockConversations.filter(conv => conv.hasCallScheduled).length;
  const ordersPlaced = mockConversations.filter(conv => conv.hasOrderPlaced).length;

  useEffect(() => {
    console.log("Overview component rendered.");
    console.log("Total Conversations:", totalConversations);
    console.log("Appointments Booked:", appointmentsBooked);
  }, [totalConversations, appointmentsBooked]);

  return (
    <div className="dashboard-section">
      <h1>Dashboard Overview</h1>
      <p>Welcome to your chatbot management dashboard. Here's a quick overview of your bot's activity.</p>

      <div className="summary-widgets">
        <div className="widget">
          <h2>Total Conversations</h2>
          <p>{totalConversations}</p>
        </div>
        <div className="widget">
          <h2>Appointments Booked</h2>
          <p>{appointmentsBooked}</p>
        </div>
        <div className="widget">
          <h2>Calls Scheduled</h2>
          <p>{callsScheduled}</p>
        </div>
        <div className="widget">
          <h2>Orders Placed</h2>
          <p>{ordersPlaced}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
