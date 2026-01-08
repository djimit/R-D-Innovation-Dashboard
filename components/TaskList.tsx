
import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface TaskListProps {
  tasks: string[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggleTask = (index: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompleted(newCompleted);
  };

  return (
    <div className="space-y-3">
      {tasks.map((task, idx) => {
        const isDone = completed.has(idx);
        return (
          <div 
            key={idx}
            onClick={() => toggleTask(idx)}
            className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
              isDone 
                ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 transform ${
              isDone 
                ? 'bg-emerald-500 border-emerald-500 scale-110' 
                : 'bg-transparent border-slate-300 group-hover:border-blue-400'
            }`}>
              {isDone && (
                <Check 
                  size={12} 
                  className="text-white animate-[checkmark_0.3s_ease-out_forwards]" 
                />
              )}
            </div>
            <span className={`text-sm transition-all duration-300 ${
              isDone ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'
            }`}>
              {task}
            </span>
          </div>
        );
      })}
      
      <style>{`
        @keyframes checkmark {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TaskList;
