import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  alertLevel?: 'normal' | 'warning' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, alertLevel = 'normal' }) => {
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'warning':
        return 'text-accent';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${getAlertColor(alertLevel)}`}>
        {value}
      </div>
    </div>
  );
};

export default MetricCard;