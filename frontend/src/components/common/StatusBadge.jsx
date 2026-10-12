import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toUpperCase();
  let className = 'badge-pending';

  if (s === 'APPROVED' || s === 'ACTIVE') className = 'badge-approved';
  else if (s === 'COMPLETED' || s === 'PAID') className = 'badge-completed';
  else if (s === 'CANCELLED' || s === 'REJECTED' || s === 'INACTIVE') className = 'badge-cancelled';

  return <span className={`badge ${className}`}>{status}</span>;
};

export default StatusBadge;
