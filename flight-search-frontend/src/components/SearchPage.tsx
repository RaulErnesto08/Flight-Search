import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportCitySearchModal from './AirportCitySearchModal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const SearchPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalFor, setModalFor] = useState<'departure' | 'arrival'>('departure');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [departureDate, setDepartureDate] = useState<Value>(new Date());
  const [returnDate, setReturnDate] = useState<Value>(null);
  const navigate = useNavigate();

  const handleModalOpen = (field: 'departure' | 'arrival') => {
    setModalFor(field);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleUseIataCode = (iataCode: string) => {
    if (modalFor === 'departure') {
      setDepartureAirport(iataCode);
    } else {
      setArrivalAirport(iataCode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchParams = new URLSearchParams({
      origin: departureAirport,
      destination: arrivalAirport,
      departureDate: departureDate instanceof Date ? departureDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      returnDate: returnDate instanceof Date ? returnDate.toISOString().split('T')[0] : '',
      currency: (document.getElementById('currency') as HTMLInputElement).value,
      adults: (document.getElementById('number-adults') as HTMLInputElement).value || '1',
      nonStop: (document.getElementById('non-stop') as HTMLInputElement).checked ? 'true' : 'false'
    }).toString();

    navigate(`/results?${searchParams}`);
  };

  const handleDepartureDateChange = (value: Value) => {
    setDepartureDate(value);
  };

  const handleReturnDateChange = (value: Value) => {
    setReturnDate(value);
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
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
              Please enter your flight information
            </span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
          <div className="grid grid-cols-2 gap-8">
            <div className="rounded-md shadow-sm">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="departure-airport">
                Departure Airport
              </label>
              <input
                id="departure-airport"
                name="departure-airport"
                type="text"
                value={departureAirport}
                placeholder="SFO"
                onChange={(e) => setDepartureAirport(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <a
                href="#"
                className="font-light text-indigo-600 text-xs"
                onClick={() => handleModalOpen('departure')}
              >
                If you don't know your Airport code click here
              </a>
            </div>
            <div className="rounded-md shadow-sm">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="arrival-airport">
                Arrival Airport
              </label>
              <input
                id="arrival-airport"
                name="arrival-airport"
                type="text"
                value={arrivalAirport}
                placeholder="LAX"
                onChange={(e) => setArrivalAirport(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <a
                href="#"
                className="font-light text-indigo-600 text-xs"
                onClick={() => handleModalOpen('arrival')}
              >
                If you don't know your Airport code click here
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="rounded-md shadow-sm">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="departure-date">
                Departure Date
              </label>
              <Calendar
                value={departureDate}
                onChange={handleDepartureDateChange}
                minDate={new Date()}
              />
            </div>
            <div className="rounded-md shadow-sm">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="return-date">
                Return Date
              </label>
              <Calendar
                  value={returnDate}
                  onChange={handleReturnDateChange}
                  minDate={departureDate instanceof Date ? departureDate : new Date()}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="rounded-md shadow-sm">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="currency">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="rounded-md shadow-sm">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="number-adults">
                Number of Adults
              </label>
              <input
                id="number-adults"
                defaultValue={1}
                name="number-adults"
                type="number"
                className="w-full p-2 border border-gray-300 rounded placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-8'>
            <div className="flex items-center">
                <input
                  id="non-stop"
                  name="non-stop"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="non-stop"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Non-Stop Flight
                </label>
              </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <AirportCitySearchModal
        isOpen={showModal}
        onClose={handleModalClose}
        onUse={handleUseIataCode}
        forField={modalFor}
      />
    </div>
  );
};

export default SearchPage;