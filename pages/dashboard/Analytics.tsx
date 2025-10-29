import React, { useState } from 'react';
import './dashboard.css';

// Placeholder for a simple animated counter hook if needed, for now just displays the value
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  // In a real app, this would animate from 0 to value
  return <span>{value}</span>;
};

interface AnalyticCardProps {
  title: string;
  value: number;
  icon: string;
  unit?: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({ title, value, icon, unit = '' }) => (
  <div className="analytic-card widget">
    <div className="card-icon">{icon}</div>
    <div className="card-content">
      <h3>{title}</h3>
      <p className="card-value"><AnimatedCounter value={value} />{unit}</p>
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const [intentions] = useState([
    { name: 'Prendre rendez-vous', count: 45, icon: '📅' },
    { name: 'Voir tarifs', count: 30, icon: '💰' },
    { name: 'Demander un devis', count: 25, icon: '✉️' },
    { name: 'Voir portfolio', count: 50, icon: '🖼️' },
    { name: 'Autre', count: 20, icon: '❓' },
  ]);

  return (
    <div className="dashboard-section analytics-view">
      <h1>Chatbot Analytics & Insights</h1>
      <p>Gain insights into your chatbot's performance and user interactions.</p>

      <div className="analytics-grid">
        <AnalyticCard title="Messages échangés" value={1500} icon="💬" />
        <AnalyticCard title="Rendez-vous pris" value={120} icon="📅" />
        <AnalyticCard title="Commandes validées" value={85} icon="🛍️" />
        <AnalyticCard title="Taux de conversion" value={15} icon="🚀" unit="%" />
      </div>

      <div className="most-frequent-intentions widget">
        <h2>Intentions les plus fréquentes</h2>
        <ul>
          {intentions.map((intent, index) => (
            <li key={index}>
              <span className="intention-icon">{intent.icon}</span>
              <span className="intention-name">{intent.name}</span>
              <span className="intention-count">{intent.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
