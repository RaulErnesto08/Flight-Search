import './App.css'
import SearchPage from './components/SearchPage'
import FlightResultsPage from './components/FlightResultsPage';
import FlightDetailsPage from './components/FlightDetailsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SearchPage />} />
        <Route path='/results' element={<FlightResultsPage />} />
        <Route path='/details/:flightId' element={<FlightDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
