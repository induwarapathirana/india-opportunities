import React, { useState } from 'react';
import Badge from '../common/Badge';
import InfoItem from '../common/InfoItem';
import AvailableSlots from '../common/AvailableSlots';
import { Tooltip, TooltipContent, TooltipTrigger } from '../common/Tooltip';
import { Home, MapPin, DollarSign, ExternalLink, Info } from 'react-feather';

function OpportunityCard({ opportunity, darkMode }) {
  const [showTooltip, setShowTooltip] = useState(false);

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
    logistics_info,
  } = opportunity;

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    } shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row`}>
      <div className="relative h-40 md:h-auto md:w-1/3 lg:w-1/4">
        {cover_photo ? (
          <img src={cover_photo.url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image available</div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge text={programme?.short_name_display} color={darkMode ? 'blue-dark' : 'blue'} />
            <Badge text={location} color={darkMode ? 'green-dark' : 'green'} />
            <Badge text={organisation?.name} color={darkMode ? 'purple-dark' : 'purple'} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="mt-4 flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger className="cursor-pointer flex items-center gap-1 text-sm">
              <Info size={16} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
              <span>Logistics Info</span>
            </TooltipTrigger>
            <TooltipContent>
              <ul className="text-sm space-y-2">
                <li>Accommodation: {logistics_info?.accommodation_covered ? 'Covered' : 'Not Covered'}, {logistics_info?.accommodation_provided ? 'Provided' : 'Not Provided'}</li>
                <li>Food: {logistics_info?.food_covered ? 'Covered' : 'Not Covered'}, {logistics_info?.food_provided ? 'Provided' : 'Not Provided'}</li>
                <li>Computer: {logistics_info?.computer_provided ? 'Provided' : 'Not Provided'}</li>
                <li>Transportation: {logistics_info?.transportation_covered ? 'Covered' : 'Not Covered'}, {logistics_info?.transportation_provided ? 'Provided' : 'Not Provided'}</li>
              </ul>
            </TooltipContent>
          </Tooltip>
          <a
            href={`https://aiesec.org/opportunity/global-volunteer/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            View Details <ExternalLink size={16} className="inline-block ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default OpportunityCard;
