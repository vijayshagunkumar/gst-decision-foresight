import React from 'react';
import '../styles/rule-explorer.css';

interface RiskBadgeProps {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  size?: 'small' | 'medium' | 'large';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'medium' }) => {
  const levelColors = {
    HIGH: '#E53E3E',
    MEDIUM: '#D69E2E',
    LOW: '#38A169'
  };

  const sizeClasses = {
    small: 'badge-small',
    medium: 'badge-medium',
    large: 'badge-large'
  };

  return (
    <span 
      className={`risk-badge ${sizeClasses[size]} risk-${level.toLowerCase()}`}
      style={{ backgroundColor: levelColors[level] }}
    >
      {level}
    </span>
  );
};

export default RiskBadge;
