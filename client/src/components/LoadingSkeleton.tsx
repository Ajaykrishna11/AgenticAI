import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="glass-panel rounded-2xl h-80 overflow-hidden border border-gray-800 p-4 flex flex-col justify-between">
          <div className="w-full h-36 bg-gray-800/60 rounded-xl mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-800/80 rounded w-3/4" />
            <div className="h-3 bg-gray-800/60 rounded w-1/2" />
            <div className="h-3 bg-gray-800/40 rounded w-full" />
          </div>
          <div className="h-8 bg-gray-800/60 rounded-xl mt-4" />
        </div>
      ))}
    </div>
  );
};
