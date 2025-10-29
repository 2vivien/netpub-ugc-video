import React, { useState } from 'react';
import { mockConversations } from '../../src/mockDashboardData';
import './dashboard.css';

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  conversationId: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 'app-1',
    clientName: 'Alice Smith',
    date: '2023-11-12',
    time: '14:00',
    service: 'Spot 4K',
    status: 'confirmed',
    conversationId: mockConversations[0].id,
  },
  {
    id: 'app-2',
    clientName: 'Diana Prince',
    date: '2023-11-05',
    time: '10:00',
    service: 'Consultation',
    status: 'pending',
    conversationId: mockConversations[3].id,
  },
  {
    id: 'app-3',
    clientName: 'Bob Johnson',
    date: '2023-11-15',
    time: '11:30',
    service: 'UGC Video',
    status: 'cancelled',
    conversationId: mockConversations[1].id,
  },
];

const Appointments: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getStatusColorClass = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="dashboard-section appointments-view">
      <h1>Appointments</h1>
      <p>Manage and track all appointments booked through the chatbot.</p>

      <div className="appointments-layout">
        <div className="calendar-panel">
          <h2>Calendar View</h2>
          <div className="calendar-grid">
            {/* Simple representation of a calendar */}
            {mockAppointments.map(app => (
              <div 
                key={app.id} 
                className={`appointment-card ${getStatusColorClass(app.status)}`}
                onClick={() => setSelectedAppointment(app)}
              >
                <h3>{app.clientName}</h3>
                <p>{app.service}</p>
                <p>{app.date} at {app.time}</p>
                <span className="appointment-status">{app.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="appointment-detail-panel">
          {selectedAppointment ? (
            <>
              <h2>Appointment Details</h2>
              <div className="detail-card">
                <h3>Client: {selectedAppointment.clientName}</h3>
                <p><strong>Service:</strong> {selectedAppointment.service}</p>
                <p><strong>Date:</strong> {selectedAppointment.date}</p>
                <p><strong>Time:</strong> {selectedAppointment.time}</p>
                <p><strong>Status:</strong> <span className={getStatusColorClass(selectedAppointment.status)}>{selectedAppointment.status}</span></p>
                <p><strong>Conversation ID:</strong> {selectedAppointment.conversationId}</p>
                
                <div className="appointment-actions">
                  <button className="action-button confirm-button">Confirm Call</button>
                  <button className="action-button complete-button">Mark as Done</button>
                  <button className="action-button comment-button">Add Comment</button>
                </div>
              </div>
            </>
          ) : (
            <p className="select-appointment-message">Select an appointment to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
