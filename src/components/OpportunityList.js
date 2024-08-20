import React, { useState, useRef, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ExternalLink, MapPin, Calendar, DollarSign, Home, Info, Bed, Utensils, Laptop, Bus } from 'lucide-react';


const GET_OPPORTUNITIES = gql`
  query searchOpportunities($page: Int, $perPage: Int, $committee: Int, $programme: Int, $search: String) {
    searchOpportunities(
      filters: { status: "open", committee: $committee, programmes: [$programme], sort: updated_at, sort_direction: desc }
      pagination: { page: $page, per_page: $perPage }
      q: $search
    ) {
      data {
        id
        cover_photo
        title
        programme {
          short_name_display
        }
        home_lc {
          id
          full_name
        }
        location
        organisation {
          name
        }
        available_slots {
          start_date
        }
        project_fee
        logistics_info {
          accommodation_covered
          accommodation_provided
          food_covered
          food_provided
          computer_provided
          transportation_covered
          transportation_provided
        }
        specifics_info {
          salary
        }
      }
      paging {
        total_items
        total_pages
      }
    }
  }
`;

function OpportunityList({ page, perPage, committee, programme, search, onPageChange }) {
  const { loading, error, data } = useQuery(GET_OPPORTUNITIES, {
    variables: { page, perPage, committee, programme, search },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <LoadingPlaceholder />;
  if (error) return <ErrorMessage error={error} />;

  const opportunities = data?.searchOpportunities?.data || [];
  const totalPages = data?.searchOpportunities?.paging?.total_pages || 1;

  return (
    <div className="space-y-8">
      {opportunities.map((opp) => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

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
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

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
          <InfoItem 
              icon={<DollarSign size={14} />} 
              label="Salary" 
              value={specifics_info?.salary || 'Not specified'}
              darkMode={darkMode}
          />
          <InfoItem 
              icon={<DollarSign size={14} />} 
              label="Fee" 
              value={`${project_fee.fee} ${project_fee.currency}`}
              darkMode={darkMode}
          />
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
            href={`https://aiesec.org/opportunity/global-talent/${id}`}
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


function Badge({ text, color }) {
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

function InfoItem({ icon, label, value, darkMode }) {
  return (
    <div className="flex items-center space-x-2">
      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{icon}</span>
      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}:</span>
      <span className={`truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value || 'N/A'}</span>
    </div>
  );
}

function AvailableSlots({ slots, darkMode }) {
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

function LogisticsInfo({ logistics_info, darkMode }) {
  return (
    <div className={`w-72 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Logistics Details</h3>
      <div className="space-y-4">
        <LogisticsItem 
          icon={<Bed size={18} />}
          label="Accommodation" 
          covered={logistics_info?.accommodation_covered}
          provided={logistics_info?.accommodation_provided}
          darkMode={darkMode}
        />
        <LogisticsItem 
          icon={<Utensils size={18} />}
          label="Food" 
          covered={logistics_info?.food_covered}
          provided={logistics_info?.food_provided}
          darkMode={darkMode}
        />
        <LogisticsItem 
          icon={<Laptop size={18} />}
          label="Computer" 
          provided={logistics_info?.computer_provided}
          darkMode={darkMode}
        />
        <LogisticsItem 
          icon={<Bus size={18} />}
          label="Transportation" 
          covered={logistics_info?.transportation_covered}
          provided={logistics_info?.transportation_provided}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

function LogisticsItem({ icon, label, covered, provided, darkMode }) {
  const formatStatus = (status) => {
    switch(status) {
      case 'covered':
        return { text: 'Covered', color: 'text-green-600' };
      case 'not_covered':
        return { text: 'Not covered', color: 'text-red-600' };
      case 'provided':
        return { text: 'Provided', color: 'text-green-600' };
      case 'not_provided':
        return { text: 'Not provided', color: 'text-red-600' };
      default:
        return { text: status, color: 'text-gray-600' };
    }
  };

  const getCoverageText = () => {
    if (covered && provided) {
      const coveredStatus = formatStatus(covered);
      const providedStatus = formatStatus(provided);
      return (
        <>
          <span className={darkMode ? coveredStatus.color.replace('600', '400') : coveredStatus.color}>
            {coveredStatus.text}
          </span>
          , 
          <span className={darkMode ? providedStatus.color.replace('600', '400') : providedStatus.color}>
            {providedStatus.text}
          </span>
        </>
      );
    }
    if (covered) {
      const status = formatStatus(covered);
      return (
        <span className={darkMode ? status.color.replace('600', '400') : status.color}>
          {status.text}
        </span>
      );
    }
    if (provided) {
      const status = formatStatus(provided);
      return (
        <span className={darkMode ? status.color.replace('600', '400') : status.color}>
          {status.text}
        </span>
      );
    }
    return 'Not specified';
  };

  return (
    <div className="flex items-start">
      <div className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{icon}</div>
      <div className="flex-grow">
        <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</p>
        <p className="text-xs">{getCoverageText()}</p>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="animate-pulse space-y-8">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gray-200 h-96 rounded-lg"></div>
      ))}
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> Unable to fetch opportunities. Please try again later.</span>
      <p>Error details: {error.message}</p>
    </div>
  );
}

export default OpportunityList;
