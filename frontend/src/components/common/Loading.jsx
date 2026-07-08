import React from 'react';

const Loading = () => {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
        <span className="text-sm font-semibold text-slate-600">Loading your workspace...</span>
      </div>
    </div>
  );
};

export default Loading;
