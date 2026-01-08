
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  isNegative?: boolean;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, isNegative, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 font-semibold ${isNegative ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isNegative ? '↓' : '↑'} {change} from benchmark
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
