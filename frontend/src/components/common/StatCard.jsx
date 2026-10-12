import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
