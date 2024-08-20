import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import OpportunityList from '../components/OpportunityList';
//import useDarkMode from '../hooks/useDarkMode';

function OpportunityListWrapper() {
  const { page = "1", committee = "1585", programme = "8" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (page === "1" && committee === "1585" && programme === "8" && !searchParams.get('q')) {
      navigate('/1/1585/8', { replace: true });
    }
  }, [page, committee, programme, searchParams, navigate]);

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    navigate(`/${newPage}/${committee}/${programme}${search ? `?q=${search}` : ''}`);
  };

  const handleCommitteeChange = (newCommittee) => {
    navigate(`/1/${newCommittee}/${programme}${search ? `?q=${search}` : ''}`);
  };

  const handleProgrammeChange = (newProgramme) => {
    navigate(`/1/${committee}/${newProgramme}${search ? `?q=${search}` : ''}`);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchParams({ q: search });
    navigate(`/1/${committee}/${programme}?q=${search}`);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen pt-32 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <AppHeader
        committee={committee}
        programme={programme}
        search={search}
        onCommitteeChange={handleCommitteeChange}
        onProgrammeChange={handleProgrammeChange}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="container mx-auto px-4 py-8">
        <OpportunityList
          page={parseInt(page, 10)}
          perPage={10}
          committee={parseInt(committee, 10)}
          programme={parseInt(programme, 10)}
          search={search}
          onPageChange={handlePageChange}
          darkMode={darkMode}
        />
      </main>
    </div>
  );
}

export default OpportunityListWrapper;