import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FraudBadgeProps {
  count: number;
  className?: string;
}

export const FraudBadge: React.FC<FraudBadgeProps> = ({ 
  count, 
  className = '' 
}) => {
  if (count === 0) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 ${className}`}>
        Aucune fraude
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 ${className}`}>
      <AlertTriangle className="w-3 h-3 mr-1" />
      {count} {count === 1 ? 'fraude' : 'fraudes'}
    </span>
  );
};