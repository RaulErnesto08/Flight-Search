import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const FlightResultsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [flights, setFlights] = useState<any[]>([]);
  const [dictionaries, setDictionaries] = useState<any>(null);
  const [sortOption, setSortOption] = useState<string>('price');
  const navigate = useNavigate();
  const location = useLocation();

  const [sortByPrice, setSortByPrice] = useState<boolean>(false);
  const [sortByDuration, setSortByDuration] = useState<boolean>(false);
  const [priceAscending, setPriceAscending] = useState<boolean>(true);
  const [durationAscending, setDurationAscending] = useState<boolean>(true);

  const sortFlights = (flights: any[]) => {
    let sortedFlights = [...flights];

    if (sortOption === 'price') {
      sortedFlights.sort((a, b) => {
        const priceDiff = parseFloat(a.price.total) - parseFloat(b.price.total);
        return priceAscending ? priceDiff : -priceDiff;
      });
    } else if (sortOption === 'duration') {
      sortedFlights.sort((a, b) => {
        const durationA = calculateTotalDuration(a.itineraries);
        const durationB = calculateTotalDuration(b.itineraries);
        const durationDiff = durationA - durationB;
        return durationAscending ? durationDiff : -durationDiff;
      });
    }
  
    return sortedFlights;
  };

  const handleSortByPriceChange = () => {
    setSortByPrice(!sortByPrice);
    setCurrentPage(1);
  };

  const handleSortByDurationChange = () => {
    setSortByDuration(!sortByDuration);
    setCurrentPage(1);
  };

  const togglePriceOrder = () => {
    setPriceAscending(!priceAscending);
    setCurrentPage(1);
  };

  const toggleDurationOrder = () => {
    setDurationAscending(!durationAscending);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchFlights = async () => {
      const params = new URLSearchParams(window.location.search);
      const url = new URL('http://localhost:8080/api/flight-offers/search');

      params.forEach((value, key) => {
        if (value !== null && value.trim() !== '') {
          url.searchParams.append(key, value);
        }
      });

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFlights(data.data);
        setDictionaries(data.dictionaries);

      } catch (error) {
        console.error('Failed to fetch flights:', error);
      }
    };

    fetchFlights();
  }, [location.search]);

  const calculateTotalDuration = (itineraries: any[]) => {
    return itineraries.reduce((totalDuration: number, itinerary: any) => {
      const hours = parseInt(itinerary.duration.substring(2, itinerary.duration.indexOf('H')));
      const minutes = parseInt(itinerary.duration.substring(itinerary.duration.indexOf('H') + 1, itinerary.duration.indexOf('M')));
      return totalDuration + hours * 60 + minutes;
    }, 0);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const getCityName = (iataCode: string) => {
    if (dictionaries && dictionaries.locations && dictionaries.locations[iataCode] && dictionaries.locations[iataCode].cityName != null) {
      return `${formatString(dictionaries.locations[iataCode].cityName)} (${iataCode})`;
    }
    return iataCode;
  };

  const getCarrierName = (carrierCode: string) => {
    if (dictionaries && dictionaries.carriers && dictionaries.carriers[carrierCode]) {
      return `${formatString(dictionaries.carriers[carrierCode])} (${carrierCode})`;
    }
  }

  const formatString = (words: string) => {
    return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  const formatDuration = (duration: string) => {
    const hours = parseInt(duration.substring(2, duration.indexOf('H')));
    const minutes = parseInt(duration.substring(duration.indexOf('H') + 1, duration.indexOf('M')));
    return `${hours}h ${minutes}m`;
  };

  const formatStopDetails = (segments: any[], duration: string) => {
    const stops = segments.length - 1;
    if (stops === 0) {
      return [`${formatDuration(duration)} (Non-stop)`];
    }
    const stopDetails = segments.slice(0, -1).map((segment, index) => {
      const layoverTime = calculateLayoverTime(segment.arrival.at, segments[index + 1].departure.at);
      const stopCity = getCityName(segment.arrival.iataCode);
      return `${layoverTime} in ${stopCity}`;
    });
    return [`${formatDuration(duration)} (${stops} stop${stops > 1 ? 's' : ''})`, ...stopDetails];
  };

  const calculateLayoverTime = (arrivalTime: string, nextDepartureTime: string) => {
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(nextDepartureTime);
    const diff = Math.abs(departureDate.getTime() - arrivalDate.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const sortedFlights = sortFlights(flights);
  const paginatedData = sortedFlights.slice(startIndex, endIndex);
  const totalPages = Math.ceil(flights.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDetailsClick = (flightId: string) => {
    navigate(`/details/${flightId}`);
  };

  return (
    <div>
      <div>
        <img
          className="mx-auto h-36 w-auto"
          src="https://www.reshot.com/preview-assets/icons/W3RM9V4JH2/search-for_flight-W3RM9V4JH2.svg"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Flight Search
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <span className="font-medium text-indigo-600">
            Here is your flight information
          </span>
        </p>
      </div>
      <div className="max-w-full mx-auto py-10 px-8">
        <button
          className="mb-4 flex px-4 py-2 bg-gray-300 rounded text-gray-800"
          onClick={() => navigate(`/`)}
        >
          &lt; Return to Search
        </button>

        <div className="mb-6 flex space-x-4">
          <div>
            <label htmlFor="sortSelect" className="mr-2 font-semibold">
              Sort by:
            </label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border rounded"
            >
              <option value="price">Price</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortByPrice" className="mr-2 font-semibold">
              Sort by Price:
            </label>
            <button
                className="ml-2 p-2 bg-gray-300 rounded"
                onClick={togglePriceOrder}
              >
                {priceAscending ? 'Asc' : 'Desc'}
              </button>
          </div>

          <div>
            <label htmlFor="sortByDuration" className="mr-2 font-semibold">
              Sort by Duration:
            </label>
            <button
                className="ml-2 p-2 bg-gray-300 rounded"
                onClick={toggleDurationOrder}
              >
                {durationAscending ? 'Asc' : 'Desc'}
              </button>
          </div>
        </div>

        <div className="space-y-4">
          {paginatedData.map((flight) => (
            <div
              key={flight.id}
              className="p-6 border rounded shadow-sm grid grid-cols-3 bg-white"
            >
              {flight.itineraries.map((itinerary: any, itineraryIndex: number) => (
                <div key={itineraryIndex} className="col-span-3 grid grid-cols-3 mb-4">
                  <div className='text-start'>
                    <p className="text-xl font-semibold">
                      {getCityName(itinerary.segments[0].departure.iataCode)} -{' '}
                      {getCityName(itinerary.segments.slice(-1)[0].arrival.iataCode)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        itinerary.segments[0].departure.at
                      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      -{' '}
                      {new Date(
                        itinerary.segments.slice(-1)[0].arrival.at
                      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getCarrierName(itinerary.segments[0].carrierCode)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {formatStopDetails(itinerary.segments, itinerary.duration).map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>

                  {itineraryIndex === 0 && (
                    <div className="text-right">
                      <p className="text-xl font-semibold">
                        {Number(flight.price.total).toFixed(2)} {flight.price.currency}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(
                          Number(flight.price.total) /
                          flight.itineraries.length
                        ).toFixed(2)}{' '}
                        {flight.price.currency} per traveler
                      </p>
                      <button
                        className='mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
                        onClick={() => handleDetailsClick(flight.id)}
                      >
                        Details
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-indigo-600 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-indigo-600 text-white rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightResultsPage;