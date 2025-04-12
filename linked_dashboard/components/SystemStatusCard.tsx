import React from 'react';

interface SystemStatusCardProps {
  title: string;
  status: string;
  icon: string;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ title, status, icon }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-sm px-2 py-1 rounded-full inline-block ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

export default SystemStatusCard;