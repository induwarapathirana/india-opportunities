import React from 'react';
import Badge from '../common/Badge';
import InfoItem from '../common/InfoItem';
import AvailableSlots from '../common/AvailableSlots';
import LogisticsItem from '../common/LogisticsItem';

function OpportunityCard({ opportunity, darkMode }) {
  // Component implementation
  const {
    id,
    cover_photo,
    title,
    programme,
    home_lc,
    location,
    organisation,
    available_slots,
    project_fee,
    logistics_info
  } = opportunity;

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white'
    } shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row`}>
      <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
        {cover_photo ? (
          <img src={cover_photo.url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image available</div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-4">
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge text={programme?.short_name_display} color={darkMode ? 'blue-dark' : 'blue'} />
            <Badge text={location} color={darkMode ? 'green-dark' : 'green'} />
            <Badge text={organisation?.name} color={darkMode ? 'purple-dark' : 'purple'} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2 text-sm">
            <InfoItem icon={<Home size={16} />} label="Home LC" value={home_lc?.full_name} darkMode={darkMode} />
            <InfoItem icon={<MapPin size={16} />} label="Location" value={location} darkMode={darkMode} />
            <InfoItem 
              icon={<DollarSign size={16} />} 
              label="Project Fee" 
              value={`${project_fee.fee} ${project_fee.currency}`}
              darkMode={darkMode}
            />
          </div>
          <div>
            <AvailableSlots slots={available_slots} darkMode={darkMode} />
          </div>
        </div>
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mb-4`}>
          <h3 className={`text-md font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Logistics Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <LogisticsItem label="Accommodation" covered={logistics_info?.accommodation_covered} provided={logistics_info?.accommodation_provided} darkMode={darkMode} />
            <LogisticsItem label="Food" covered={logistics_info?.food_covered} provided={logistics_info?.food_provided} darkMode={darkMode} />
            <LogisticsItem label="Computer" provided={logistics_info?.computer_provided} darkMode={darkMode} />
            <LogisticsItem label="Transportation" covered={logistics_info?.transportation_covered} provided={logistics_info?.transportation_provided} darkMode={darkMode} />
          </div>
        </div>
        <div className="mt-auto">
          <a
            href={`https://aiesec.org/opportunity/global-volunteer/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out text-center`}
          >
            View Details <ExternalLink size={16} className="inline-block ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default OpportunityCard;