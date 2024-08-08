import React from 'react';

function LogisticsItem({ label, covered, provided, darkMode }) {
  // Component implementation
  const getCoverageText = () => {
    if (covered && provided) return 'Covered & Provided';
    if (covered) return 'Covered';
    if (provided) return 'Provided';
    return 'Not Covered/Provided';
  };
  
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}:</span>
      <span className={`text-xs ${
        covered || provided 
          ? darkMode ? 'text-green-400' : 'text-green-600'
          : darkMode ? 'text-red-400' : 'text-red-600'
      }`}>
        {getCoverageText()}
      </span>
    </div>
  );
}

export default LogisticsItem;