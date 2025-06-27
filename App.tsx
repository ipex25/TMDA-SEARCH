
import React, { useState, useCallback } from 'react';
import { SearchCategory, SearchResultItem, DatabaseType } from './types';
import { performSearch } from './services/geminiService';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [databaseType, setDatabaseType] = useState<DatabaseType>(DatabaseType.REGISTERED_DEVICES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>(SearchCategory.PRODUCT_NAME);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchResults([]);

    try {
      const results = await performSearch(searchQuery, searchCategory, databaseType);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchCategory, databaseType]);
  
  const StethoscopeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4h-1a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2H8a4 4 0 0 0-4 4Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <StethoscopeIcon className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">TMDA Database Search</h1>
          </div>
          <p className="text-lg text-gray-500">
            Find registered medicines & medical devices in the TMDA portal
          </p>
        </header>

        <main>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="mb-6">
                <label className="block text-center text-md font-medium text-gray-700 mb-3">Select Database to Search</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {Object.values(DatabaseType).map((db) => (
                        <button
                            key={db}
                            type="button"
                            onClick={() => setDatabaseType(db)}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                                databaseType === db 
                                ? 'bg-blue-600 text-white shadow' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {db}
                        </button>
                    ))}
                </div>
            </div>
            <SearchForm
              query={searchQuery}
              setQuery={setSearchQuery}
              category={searchCategory}
              setCategory={setSearchCategory}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[300px] flex flex-col justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Spinner />
                <p className="mt-2 text-lg">Searching {databaseType}...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            ) : hasSearched ? (
              <ResultsTable results={searchResults} />
            ) : (
                <div className="text-center text-gray-400">
                    <p>Select a database and enter a search term to begin.</p>
                </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-8 text-sm text-gray-400">
          <p>Disclaimer: This is a demonstration app using a generative AI. Results are simulated and not from the official TMDA database.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
