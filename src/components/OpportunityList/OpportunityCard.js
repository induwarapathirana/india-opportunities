import React, { useState } from 'react';
import Badge from '../common/Badge';
import InfoItem from '../common/InfoItem';
import AvailableSlots from '../common/AvailableSlots';
import { Tooltip, TooltipContent, TooltipTrigger } from '../common/Tooltip';
import { Home, MapPin, DollarSign, ExternalLink, Info } from 'react-feather';

function OpportunityCard({ opportunity, darkMode }) {
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
    specifics_info
  } = opportunity;

  const [showTooltip, setShowTooltip] = useState(false);
  //const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  //const [showPopup, setShowPopup] = useState(false);

  const isGTaorGTe = programme === 8 || programme === 9;

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white'
    } shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row`}>
      <div className="relative h-32 md:h-auto md:w-1/4">
        {cover_photo ? (
          <img src={cover_photo.url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image</div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-2">
          <h2 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge text={programme?.short_name_display} color={darkMode ? 'blue-dark' : 'blue'} />
            <Badge text={location} color={darkMode ? 'green-dark' : 'green'} />
            <Badge text={organisation?.name} color={darkMode ? 'purple-dark' : 'purple'} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <InfoItem icon={<Home size={14} />} label="Home LC" value={home_lc?.full_name} darkMode={darkMode} />
          <InfoItem icon={<MapPin size={14} />} label="Location" value={location} darkMode={darkMode} />
          {isGTaorGTe ? (
            <InfoItem 
              icon={<DollarSign size={14} />} 
              label="Salary" 
              value={specifics_info?.salary || 'Not specified'}
              darkMode={darkMode}
            />
          ) : (
            <InfoItem 
              icon={<DollarSign size={14} />} 
              label="Fee" 
              value={`${project_fee.fee} ${project_fee.currency}`}
              darkMode={darkMode}
            />
          )}
          <div 
          ref={buttonRef}
          className={`flex items-center cursor-pointer ${
            darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'
          } px-2 py-1 rounded-md`}
          onClick={handleTooltipToggle}
        >
          <Info size={14} className="mr-1" />
          <span className="font-semibold">Logistics Info</span>
        </div>
      </div>
        <AvailableSlots slots={available_slots} darkMode={darkMode} />
        <div className="mt-2">
          <a
            href={`https://aiesec.org/opportunity/global-volunteer/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out text-center text-sm`}
          >
            View Details <ExternalLink size={14} className="inline-block ml-1" />
          </a>
        </div>
      </div>
      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="absolute z-20"
          style={{
            top: buttonRef.current ? buttonRef.current.offsetTop + buttonRef.current.offsetHeight + 10 : 0,
            left: buttonRef.current ? buttonRef.current.offsetLeft : 0,
          }}
        >
          <div className="relative">
            <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-white dark:bg-gray-800"></div>
            <div className="max-h-72 overflow-y-auto">
              <LogisticsInfo logistics_info={logistics_info} darkMode={darkMode} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpportunityCard;
