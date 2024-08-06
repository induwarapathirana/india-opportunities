import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronDown, Check, Moon, Sun } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import OpportunityList from './components/OpportunityList';

// Apollo Client setups
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.REACT_APP_API_TOKEN;
  return {
    headers: {
      ...headers,
      Authorization: token,
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error
  }
});

const client = new ApolloClient({
  link: retryLink.concat(errorLink.concat(authLink.concat(httpLink))),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  }
});


const homeLcOptions = [
  { id: 4567, full_name: '-' },
  { id: 608, full_name: 'Ahmedabad' },
  { id: 1490, full_name: 'Bengaluru' },
  { id: 2872, full_name: 'Bhopal' },
  { id: 1669, full_name: 'Bhubaneswar' },
  { id: 1449, full_name: 'Chandigarh' },
  { id: 630, full_name: 'Chennai' },
  { id: 228, full_name: 'Closed' },
  { id: 2283, full_name: 'Closed' },
  { id: 2280, full_name: 'Closed' },
  { id: 2284, full_name: 'Closed' },
  { id: 4566, full_name: 'Closed' },
  { id: 2282, full_name: 'Closed' },
  { id: 432, full_name: 'Closed' },
  { id: 2281, full_name: 'CLOSED' },
  { id: 21, full_name: 'Dehradun' },
  { id: 651, full_name: 'Delhi IIT' },
  { id: 588, full_name: 'Delhi University' },
  { id: 632, full_name: 'Hyderabad' },
  { id: 2340, full_name: 'India National Office' },
  { id: 272, full_name: 'Indore' },
  { id: 616, full_name: 'JAIPUR' },
  { id: 241, full_name: 'Jalandhar' },
  { id: 14, full_name: 'Jodhpur' },
  { id: 631, full_name: 'Kolkata' },
  { id: 5787, full_name: 'Lucknow' },
  { id: 1794, full_name: 'Ludhiana' },
  { id: 273, full_name: 'M.A.H.E.' },
  { id: 1393, full_name: 'Mumbai' },
  { id: 2289, full_name: 'Nagpur' },
  { id: 150, full_name: 'Navi Mumbai' },
  { id: 2873, full_name: 'Noida' },
  { id: 74, full_name: 'Patiala' },
  { id: 1418, full_name: 'Pune' },
  { id: 229, full_name: 'Surat' },
  { id: 75, full_name: 'Visakhapatnam' },
  { id: 2012, full_name: 'VIT' },
];

const programmeOptions = [
  { id: 7, full_name: 'Global Volunteer' },
  { id: 8, full_name: 'Global Talent' },
  { id: 9, full_name: 'Global Teacher' }
];


function Dropdown({ options, selected, onChange, placeholder, darkMode }) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className={`relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${
          darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
        }`}>
          <span className="block truncate">{selected ? selected.full_name : placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-amber-100 text-amber-900'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-900'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.full_name}
                    </span>
                    {selected ? (
                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        darkMode ? 'text-amber-500' : 'text-amber-600'
                      }`}>
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

function AppHeader({ committee, programme, search, onCommitteeChange, onProgrammeChange, onSearchChange, onSearchSubmit, darkMode, toggleDarkMode }) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 ${
      darkMode
        ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
    } py-4 px-4 shadow-lg z-50`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0 text-center md:text-left whitespace-nowrap overflow-hidden text-ellipsis">AIESEC in India | Opportunities</h1>
        <form onSubmit={onSearchSubmit} className="relative mb-2 md:mb-0 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder="Search opportunities..."
            className={`pl-10 pr-4 py-2 rounded-full w-full ${
              darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-white bg-opacity-20 focus:bg-opacity-100 focus:text-gray-800'
            } transition-all duration-300`}
          />
          <button type="submit" className="hidden">Search</button>
        </form>
        <div className="w-full md:hidden">
          <button
            onClick={toggleFilters}
            className="flex items-center justify-center space-x-2 py-2 px-4 bg-gray-700 text-white rounded-lg"
          >
            <Filter />
            <span>Filter</span>
          </button>
          <Transition
            show={showFilters}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="mt-2 flex flex-col space-y-2 w-full bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2 w-full">
                <Filter className="text-gray-700" />
                <div className="w-full">
                  <Dropdown
                    options={homeLcOptions}
                    selected={homeLcOptions.find(option => option.id === parseInt(committee, 10))}
                    onChange={(selectedOption) => onCommitteeChange(selectedOption.id)}
                    placeholder="Select Committee"
                    darkMode={darkMode}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 w-full">
                <Filter className="text-gray-700" />
                <div className="w-full">
                  <Dropdown
                    options={programmeOptions}
                    selected={programmeOptions.find(option => option.id === parseInt(programme, 10))}
                    onChange={(selectedOption) => onProgrammeChange(selectedOption.id)}
                    placeholder="Select Programme"
                    darkMode={darkMode}
                  />
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </Transition>
        </div>
        <div className="hidden md:flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full justify-center">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="text-gray-200" />
            <div className="w-full">
              <Dropdown
                options={homeLcOptions}
                selected={homeLcOptions.find(option => option.id === parseInt(committee, 10))}
                onChange={(selectedOption) => onCommitteeChange(selectedOption.id)}
                placeholder="Select Committee"
                darkMode={darkMode}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="text-gray-200" />
            <div className="w-full">
              <Dropdown
                options={programmeOptions}
                selected={programmeOptions.find(option => option.id === parseInt(programme, 10))}
                onChange={(selectedOption) => onProgrammeChange(selectedOption.id)}
                placeholder="Select Programme"
                darkMode={darkMode}
              />
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full self-center md:self-start ${
              darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}


function OpportunityListWrapper() {
  const { page = "1", committee = "1585", programme = "7" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (page === "1" && committee === "1585" && programme === "1" && !searchParams.get('q')) {
      navigate('/1/1585/1', { replace: true });
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

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/:page?/:committee?/:programme?" element={<OpportunityListWrapper />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;