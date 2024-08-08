import React from 'react';

function InfoItem({ icon, label, value, darkMode }) {
  // Component implementation
  return (
    <div className="flex items-center space-x-2">
      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{icon}</span>
      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}:</span>
      <span className={`truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value || 'N/A'}</span>
    </div>
  );
}

export default InfoItem;