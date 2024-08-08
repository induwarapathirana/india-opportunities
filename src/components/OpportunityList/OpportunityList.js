import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { ExternalLink, MapPin, Calendar, DollarSign, Home } from 'lucide-react';
import OpportunityCard from './OpportunityCard';
import Pagination from './Pagination';
import LoadingPlaceholder from '../common/LoadingPlaceholder';
import ErrorMessage from '../common/ErrorMessage';

const GET_OPPORTUNITIES = gql`
  // Query definition

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
      }
      paging {
        total_items
        total_pages
      }
    }
  }
`;

function OpportunityList({ page, perPage, committee, programme, search, onPageChange, darkMode }) {
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
        <OpportunityCard key={opp.id} opportunity={opp} darkMode={darkMode} />
      ))}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default OpportunityList;