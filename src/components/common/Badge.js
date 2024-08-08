import React from 'react';

function Badge({ text, color }) {
  // Component implementation
  const colorClasses = {
    'blue': 'bg-blue-100 text-blue-800',
    'green': 'bg-green-100 text-green-800',
    'purple': 'bg-purple-100 text-purple-800',
    'blue-dark': 'bg-blue-800 text-blue-200',
    'green-dark': 'bg-green-800 text-green-200',
    'purple-dark': 'bg-purple-800 text-purple-200',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClasses[color]}`}>
      {text}
    </span>
  );
}

export default Badge;