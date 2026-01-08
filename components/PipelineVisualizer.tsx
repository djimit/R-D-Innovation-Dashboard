
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PipelineMetrics } from '../types';

interface PipelineVisualizerProps {
  traditional: PipelineMetrics;
  enhanced: PipelineMetrics;
}

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ traditional, enhanced }) => {
  const data = [
    { name: 'Discovery', Traditional: traditional.discoveryYears, AI: enhanced.discoveryYears },
    { name: 'Pre-Clinical', Traditional: traditional.preClinicalYears, AI: enhanced.preClinicalYears },
    { name: 'Phase 1', Traditional: traditional.clinicalPhase1Years, AI: enhanced.clinicalPhase1Years },
    { name: 'Phase 2', Traditional: traditional.clinicalPhase2Years, AI: enhanced.clinicalPhase2Years },
    { name: 'Phase 3', Traditional: traditional.clinicalPhase3Years, AI: enhanced.clinicalPhase3Years },
    { name: 'Regulatory', Traditional: traditional.regulatoryYears, AI: enhanced.regulatoryYears },
  ];

  // Fix: Cast Object.values results to number[] to resolve 'unknown' type errors during reduce and arithmetic operations.
  const totalTrad = (Object.values(traditional).slice(0, 6) as number[]).reduce((a, b) => a + b, 0);
  const totalAI = (Object.values(enhanced).slice(0, 6) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Pipeline Timeline Comparison (Years)</h3>
        <div className="flex gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
            <span>Traditional ({totalTrad.toFixed(1)} yrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>AI Optimized ({totalAI.toFixed(1)} yrs)</span>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Years', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="Traditional" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="AI" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PipelineVisualizer;
