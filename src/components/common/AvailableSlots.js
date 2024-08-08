import React from 'react';
import InfoItem from './InfoItem';

function AvailableSlots({ slots, darkMode }) {
  // Component implementation
  if (!slots || slots.length === 0) {
    return <InfoItem icon={<Calendar size={16} />} label="Available Slots" value="Contact your IR partner to arrange slots." darkMode={darkMode} />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
        <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Available Slots:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot, index) => (
          <div key={index} className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
          }`}>
            {new Date(slot.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableSlots;