import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Synchronizing study workspace...' }) => {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
      <p className="text-xs text-slate-500 font-medium tracking-wide">{message}</p>
      
      {/* Skeleton cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg animate-pulse space-y-3">
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="h-6 bg-slate-100 rounded w-2/3" />
            <div className="h-2 bg-slate-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
