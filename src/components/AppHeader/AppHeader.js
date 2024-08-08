import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Check, Moon, Sun } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import Dropdown from './Dropdown';
import { homeLcOptions, programmeOptions } from '../../data';

function AppHeader({ committee, programme, search, onCommitteeChange, onProgrammeChange, onSearchChange, onSearchSubmit, darkMode, toggleDarkMode }) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-4 px-4 shadow-lg z-50`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="https://aiesec-logos.s3.eu-west-1.amazonaws.com/White-Black-Logo.png" alt="AIESEC Logo" className="h-8 md:h-10" />
          <h1 className="text-2xl md:text-3xl font-bold mb-0 text-left whitespace-nowrap overflow-hidden text-ellipsis">Opportunities</h1>
        </div>
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

export default AppHeader;