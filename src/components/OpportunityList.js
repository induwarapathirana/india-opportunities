import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ExternalLink, MapPin, Calendar, DollarSign, Home, Search } from 'lucide-react';

const GET_OPPORTUNITIES = gql`
  query searchOpportunities($page: Int, $perPage: Int, $committee: Int, $programme: Int, $search: String) {
    searchOpportunities(
      filters: { status: "open", committee: $committee, programmes: [$programme] }
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

function OpportunityCard({ opportunity }) {
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {cover_photo ? (
          <img src={cover_photo.url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image available</div>
        )}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
          <h2 className="text-xl font-bold text-white truncate">{title}</h2>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge text={programme?.short_name_display} color="blue" />
          <Badge text={location} color="green" />
          <Badge text={organisation?.name} color="purple" />
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <InfoItem icon={<Home size={16} />} label="Home LC" value={home_lc?.full_name} />
          <InfoItem icon={<Calendar size={16} />} label="Start Date" value={available_slots?.[0]?.start_date} />
          <InfoItem icon={<DollarSign size={16} />} label="Project Fee" value={`${project_fee.fee} ${project_fee.currency}`} />
          <InfoItem icon={<MapPin size={16} />} label="Location" value={location} />
        </div>
        <div className="border-t pt-4">
          <h3 className="text-md font-semibold mb-2">Logistics Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <LogisticsItem label="Accommodation" covered={logistics_info?.accommodation_covered} provided={logistics_info?.accommodation_provided} />
            <LogisticsItem label="Food" covered={logistics_info?.food_covered} provided={logistics_info?.food_provided} />
            <LogisticsItem label="Computer" provided={logistics_info?.computer_provided} />
            <LogisticsItem label="Transportation" covered={logistics_info?.transportation_covered} provided={logistics_info?.transportation_provided} />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <a
          href={`https://aiesec.org/opportunity/global-volunteer/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out text-center"
        >
          View Details <ExternalLink size={16} className="inline-block ml-1" />
        </a>
      </div>
    </div>
  );
}

function Badge({ text, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClasses[color]}`}>
      {text}
    </span>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="font-semibold">{label}:</span>
      <span className="truncate">{value || 'N/A'}</span>
    </div>
  );
}

function LogisticsItem({ label, covered, provided }) {
  const getCoverageText = () => {
    if (covered && provided) return 'Covered & Provided';
    if (covered) return 'Covered';
    if (provided) return 'Provided';
    return 'Not Covered/Provided';
  };
  
  return (
    <div className="flex items-center">
      <span className="text-sm font-semibold mr-2">{label}:</span>
      <span className={`text-xs ${covered || provided ? 'text-green-600' : 'text-red-600'}`}>
        {getCoverageText()}
      </span>
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