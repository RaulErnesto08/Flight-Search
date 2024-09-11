import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const FlightDetailsPage = () => {
  const { flightId } = useParams();
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [dictionaries, setDictionaries] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/flight-offers/details/${flightId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFlightDetails(data.flightOffer);
        setDictionaries(data.dictionaries);
      } catch (error) {
        console.error('Failed to fetch flight details:', error);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  const getCityName = (iataCode: string) => {
    if (dictionaries && dictionaries.locations && dictionaries.locations[iataCode] && dictionaries.locations[iataCode].cityName != null) {
      return `${formatString(dictionaries.locations[iataCode].cityName)} (${iataCode})`;
    }
    return iataCode;
  };

  const getCarrierName = (carrierCode: string) => {
    return formatString(dictionaries?.carriers?.[carrierCode]) || carrierCode;
  };

  const getAircraftName = (aircraftCode: string) => {
    return formatString(dictionaries?.aircraft?.[aircraftCode]) || aircraftCode;
  };

  const formatString = (words: string) => {
    return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  const formatDuration = (duration: string) => {
    const hours = parseInt(duration.substring(2, duration.indexOf('H')));
    const minutes = parseInt(duration.substring(duration.indexOf('H') + 1, duration.indexOf('M')));
    return `${hours}h ${minutes}m`;
  };

  const calculateLayoverTime = (arrivalTime: string, nextDepartureTime: string) => {
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(nextDepartureTime);
    const diff = Math.abs(departureDate.getTime() - arrivalDate.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m layover`;
  };

  if (!flightDetails || !dictionaries) return <div>Loading...</div>;

  return (
    <div>
      <div className='mb-4'>
        <img
          className="mx-auto h-36 w-auto"
          src="https://www.reshot.com/preview-assets/icons/W3RM9V4JH2/search-for_flight-W3RM9V4JH2.svg"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Flight Search
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <span className="font-medium text-indigo-600">
            Here are the details of your flight
          </span>
        </p>
      </div>
      <div className="flex justify-between space-x-4 mb-4">
        <button
          onClick={() => window.history.back() }
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back to Results
        </button>
        <button
          onClick={() => navigate(`/`)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Make a New Search
        </button>
      </div>
      <div className="container mx-auto my-4 p-4 grid grid-cols-4 gap-8">
        <div className="col-span-3 space-y-4">
          {flightDetails.itineraries?.map((itinerary: any, itineraryIndex: number) => (
            <div key={itineraryIndex} className="mb-6 border p-4">
              <h3 className="text-lg font-semibold mb-4">Itinerary {itineraryIndex + 1} (Duration: {formatDuration(itinerary.duration)})</h3>
              {itinerary.segments?.map((segment: any, segmentIndex: number) => (
                <div key={segmentIndex} className="mb-4 border-b pb-4 grid grid-cols-2 gap-4">
                  <div className="text-start">
                    <h4 className="text-md font-semibold">Flight Information</h4>
                    <br />
                    <p>
                      {getCityName(segment.departure?.iataCode)} ({segment.departure?.iataCode}) - {getCityName(segment.arrival?.iataCode)} ({segment.arrival?.iataCode})
                    </p>
                    <p>
                      {new Date(segment.departure?.at).toLocaleString()} - {new Date(segment.arrival?.at).toLocaleString()}
                    </p>
                    <br />
                    <p>
                      <strong>Airline:</strong> {getCarrierName(segment.carrierCode)} ({segment.carrierCode})
                    </p>
                    <p>
                      <strong>Flight Number:</strong> {segment.number}
                    </p>
                    {segment.operating?.carrierCode && (
                      <p>
                        <strong>Operating Carrier:</strong> {getCarrierName(segment.operating.carrierCode)} ({segment.operating.carrierCode})
                      </p>
                    )}
                    <p>
                      <strong>Aircraft:</strong> {getAircraftName(segment.aircraft?.code)} ({segment.aircraft?.code})
                    </p>
                    <p>
                      <strong>Duration:</strong> {formatDuration(segment.duration)}
                    </p>
                  </div>

                  <div className="text-center">
                    <h4 className="text-md font-semibold">Traveler Fare Details</h4>
                    <br />
                    {flightDetails.travelerPricings?.map((traveler: any, travelerIndex: number) => (
                      <div key={travelerIndex} className="mb-4">
                        <p className="font-semibold">Traveler #{travelerIndex + 1}</p>
                        <p><strong>Cabin:</strong> {traveler.fareDetailsBySegment?.[segmentIndex]?.cabin}</p>
                        <p><strong>Class:</strong> {traveler.fareDetailsBySegment?.[segmentIndex]?.class}</p>
                        <div>
                          <strong>Amenities:</strong>
                          {traveler.fareDetailsBySegment?.[segmentIndex]?.amenities?.length > 0 ? (
                            traveler.fareDetailsBySegment?.[segmentIndex]?.amenities?.map((amenity: any, amenityIndex: number) => (
                              <p key={amenityIndex}>
                                {amenity.description} - {amenity.chargeable ? 'Chargeable' : 'Included'}
                              </p>
                            ))
                          ) : (
                            <p>No amenities available</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Layover Time */}
                  {itinerary.segments[segmentIndex + 1] && (
                    <p className="text-sm text-gray-600 mt-2 col-span-2">
                      {calculateLayoverTime(segment.arrival?.at, itinerary.segments[segmentIndex + 1].departure?.at)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="col-span-1 p-4 border">
          <h4 className="text-lg font-semibold mb-4">Price Breakdown</h4>
          <div className="text-start">
            <p className='mb-4'><strong>Base Price:</strong> {flightDetails.price?.base} {flightDetails.price?.currency}</p>
            <p><strong>Fees:</strong></p>
            <ul className='mb-4'>
              {flightDetails.price?.fees?.map((fee: any, index: number) => (
                <li key={index}>{fee.type}: ${fee.amount}</li>
              ))}
            </ul>
            <p className='mb-4'><strong>Total Price:</strong> {flightDetails.price?.total} {flightDetails.price?.currency}</p>
            <hr className='mb-4' />
            <h4 className="text-lg font-semibold mb-4">Per Traveler</h4>
            {flightDetails.travelerPricings?.map((traveler: any, index: number) => (
              <div key={index} className='mb-4'>
                <p><strong>Traveler {traveler.travelerId}:</strong></p>
                <p><strong>Base Price:</strong> {traveler.price.base} {traveler.price.currency}</p>
                <p><strong>Total Price:</strong> {traveler.price.total} {traveler.price.currency}</p>
                <p><strong>Fees:</strong></p>
                <ul className='mb-4'>
                  {traveler.price.fees?.map((fee: any, index: number) => (
                    <li key={index}>{fee.type}: ${fee.amount}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;