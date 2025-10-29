import React, { useState, useEffect } from 'react';
import { mockConversations, ChatConversation, ChatMessage } from '../../src/mockDashboardData';
import './dashboard.css';

const Conversations: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    console.log("Conversations component rendered.");
    console.log("Mock Conversations loaded:", mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      console.log("Selected Conversation:", selectedConversation);
    }
  }, [selectedConversation]);

  return (
    <div className="dashboard-section conversations-view">
      <h1>Chatbot Conversations</h1>
      <p>Review and manage all interactions with your chatbot.</p>

      <div className="conversations-layout">
        <div className="conversation-list-panel">
          <h2>Conversations</h2>
          <ul className="conversation-list">
            {mockConversations.map(conv => (
              <li
                key={conv.id}
                className={`conversation-list-item ${selectedConversation?.id === conv.id ? 'selected' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="user-info">
                  <img src="https://i.pravatar.cc/50" alt="User Avatar" className="conversation-avatar" />
                  <h3>{conv.userName}</h3>
                </div>
                <p className="last-message">{conv.messages[conv.messages.length - 1]?.text.substring(0, 50)}...</p>
                <p className="last-activity">{formatTimestamp(conv.lastActivity)}</p>
                <div className="conversation-flags">
                  {conv.hasAppointment && <span className="flag appointment-flag">🗓️</span>}
                  {conv.hasCallScheduled && <span className="flag call-flag">📞</span>}
                  {conv.hasOrderPlaced && <span className="flag order-flag">🛒</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-area-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <h2>Conversation with {selectedConversation.userName}</h2>
                <div className="detail-flags">
                  {selectedConversation.hasAppointment && <span className="flag appointment-flag">Appointment Booked</span>}
                  {selectedConversation.hasCallScheduled && <span className="flag call-flag">Call Scheduled</span>}
                  {selectedConversation.hasOrderPlaced && <span className="flag order-flag">Order Placed</span>}
                </div>
              </div>
              <div className="chat-messages">
                {selectedConversation.messages.map(message => (
                  <div key={message.id} className={`chat-message ${message.sender}`}>
                    <span className="message-sender">{message.sender === 'user' ? selectedConversation.userName : 'Bot'}:</span>
                    <span className="message-text">{message.text}</span>
                    <span className="message-timestamp">{formatTimestamp(message.timestamp)}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
              </div>
            </>
          ) : (
            <p className="select-conversation-message">Select a conversation to view details.</p>
          )}
        </div>

        <div className="client-detail-panel">
          {selectedConversation ? (
            <>
              <h2>Client Details</h2>
              <div className="client-info">
                <img src="https://i.pravatar.cc/100" alt="Client Avatar" className="client-avatar" />
                <h3>{selectedConversation.userName}</h3>
                <p><strong>User ID:</strong> {selectedConversation.userId}</p>
                <p><strong>Last Activity:</strong> {formatTimestamp(selectedConversation.lastActivity)}</p>
                <div className="client-actions">
                  <button className="client-action-button">Add Note</button>
                  <button className="client-action-button tag-button">Tag Client</button>
                </div>
              </div>
            </>
          ) : (
            <p className="select-conversation-message">Select a conversation to see client details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
