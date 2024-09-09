import { useState } from "react";

interface AirportCitySearchModalProps {
    isOpen:  boolean, 
    onClose: () => void,
    onUse: (iataCode: string) => void,
    forField: 'departure' | 'arrival';
}

const AirportCitySearchModal: React.FC<AirportCitySearchModalProps> = ({ isOpen, onClose, onUse }) => {
    const [subType, setSubType] = useState<'AIRPORT' | 'CITY' | 'BOTH'>('AIRPORT');
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/airport-and-city/search?subType=${subType}&keyword=${keyword}`);

            if(!response.ok) {
                throw new Error('Error fetching data');
            }

            const data = await response.json();
            setResults(data.data);

        } catch(error) {
            setError('Unable to fetch search results');
        } finally {
            setLoading(false);
        }
    };

    const handleUse = (iataCode: string) => {
        onUse(iataCode);
        onClose();
    }

    if (!isOpen) return null;
    
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Airport & City Search</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Please provide a keyword to search for an airport or city.</p>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter keyword"
                  />
                  <div className="mt-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="AIRPORT"
                        checked={subType === 'AIRPORT'}
                        onChange={() => setSubType('AIRPORT')}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2">Airport</span>
                    </label>
                    <label className="inline-flex items-center ml-4">
                      <input
                        type="radio"
                        value="CITY"
                        checked={subType === 'CITY'}
                        onChange={() => setSubType('CITY')}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2">City</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading || keyword.length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
    
              {error && <p className="text-red-500 text-sm">{error}</p>}
    
              {results.length > 0 && (
                <div className="px-4 py-4">
                  {results.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b py-2">
                      <div>
                        <p className="font-bold">{item.subType}</p>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-600">{item.detailedName}</p>
                        <p className="text-sm text-gray-600">IATA Code: {item.iataCode}</p>
                      </div>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleUse(item.iataCode)}
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    );
};

export default AirportCitySearchModal;