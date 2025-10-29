import React, { useState } from 'react';
import { mockConversations } from '../../src/mockDashboardData';
import './dashboard.css';

interface Order {
  id: string;
  clientName: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'delivered';
  date: string;
  conversationId: string;
}

const mockOrders: Order[] = [
  {
    id: 'ord-1',
    clientName: 'Bob Johnson',
    type: 'Basic UGC Package',
    status: 'confirmed',
    date: '2023-10-27',
    conversationId: mockConversations[1].id,
  },
  {
    id: 'ord-2',
    clientName: 'Alice Smith',
    type: '4K Spot Production',
    status: 'pending',
    date: '2023-11-01',
    conversationId: mockConversations[0].id,
  },
  {
    id: 'ord-3',
    clientName: 'Charlie Brown',
    type: 'Social Media Strategy',
    status: 'cancelled',
    date: '2023-10-28',
    conversationId: mockConversations[2].id,
  },
  {
    id: 'ord-4',
    clientName: 'Diana Prince',
    type: 'Premium UGC Package',
    status: 'delivered',
    date: '2023-10-25',
    conversationId: mockConversations[3].id,
  },
];

const Orders: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const filteredOrders = mockOrders.filter(order => {
    const statusMatch = filterStatus === 'all' || order.status === filterStatus;
    const dateMatch = !filterDate || order.date.includes(filterDate);
    return statusMatch && dateMatch;
  });

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 'badge-confirmed';
      case 'pending': return 'badge-pending';
      case 'cancelled': return 'badge-cancelled';
      case 'delivered': return 'badge-delivered';
      default: return '';
    }
  };

  return (
    <div className="dashboard-section orders-view">
      <h1>Orders & Actions</h1>
      <p>Track all orders and actions initiated through the chatbot.</p>

      <div className="orders-filters">
        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="delivered">Delivered</option>
        </select>
        <input 
          type="date" 
          value={filterDate} 
          onChange={(e) => setFilterDate(e.target.value)} 
          placeholder="Filter by Date"
        />
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Conversation ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.clientName}</td>
                <td>{order.type}</td>
                <td><span className={`status-badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span></td>
                <td>{order.date}</td>
                <td>{order.conversationId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
