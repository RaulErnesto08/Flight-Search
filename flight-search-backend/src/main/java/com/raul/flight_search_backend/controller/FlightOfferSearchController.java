package com.raul.flight_search_backend.controller;

import com.raul.flight_search_backend.dto.FlightOfferSearchRequest;
import com.raul.flight_search_backend.dto.FlightOfferSearchResponse;
import com.raul.flight_search_backend.service.FlightOfferSearchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/flight-offers")
public class FlightOfferSearchController {

    @Autowired
    private FlightOfferSearchService flightOfferSearchService;

    @GetMapping("/search")
    public FlightOfferSearchResponse searchFlight(@Valid @RequestParam String origin,
            @Valid @RequestParam String destination,
            @Valid @RequestParam String departureDate,
            @RequestParam(required = false) String returnDate,
            @Valid @RequestParam String currency,
            @Valid @RequestParam int adults,
            @RequestParam(required = false, defaultValue = "false") boolean nonStop) {

        FlightOfferSearchRequest request = new FlightOfferSearchRequest();

        request.setOriginLocationCode(origin);
        request.setDestinationLocationCode(destination);
        request.setDepartureDate(departureDate);
        request.setReturnDate(returnDate);
        request.setCurrency(currency);
        request.setAdults(adults);
        request.setNonStop(nonStop);

        return flightOfferSearchService.searchFlights(request);
    }

    @GetMapping("/details/{id}")
    public Map<String, Object> getFlightDetails(@PathVariable String id) {
        FlightOfferSearchResponse cachedResponse = flightOfferSearchService.getCachedResponse();

        if (cachedResponse == null || cachedResponse.getDictionaries() == null) {
            throw new RuntimeException("Dictionaries missing from the response");
        }

        FlightOfferSearchResponse.FlightOffer flightOffer = cachedResponse.getData().stream()
                .filter(offer -> offer.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("flightOffer", flightOffer);

        FlightOfferSearchResponse.Dictionaries cachedDictionaries = flightOfferSearchService.getCachedDictionaries();
        FlightOfferSearchResponse.Dictionaries relevantDictionaries = filterUsedDictionaries(flightOffer, cachedDictionaries);

        response.put("dictionaries", relevantDictionaries);

        return response;
    }

    @GetMapping("/dictionaries")
    public FlightOfferSearchResponse.Dictionaries getCachedDictionaries() {
        return flightOfferSearchService.getCachedDictionaries();
    }

    private FlightOfferSearchResponse.Dictionaries filterUsedDictionaries(FlightOfferSearchResponse.FlightOffer flightOffer,
                                                                          FlightOfferSearchResponse.Dictionaries cachedDictionaries) {
        FlightOfferSearchResponse.Dictionaries usedDictionaries = new FlightOfferSearchResponse.Dictionaries();
        usedDictionaries.setLocations(new HashMap<>());
        usedDictionaries.setAircraft(new HashMap<>());
        usedDictionaries.setCarriers(new HashMap<>());

        flightOffer.getItineraries().forEach(itinerary -> {
            itinerary.getSegments().forEach(segment -> {
                String departureIataCode = segment.getDeparture().getIataCode();
                String arrivalIataCode = segment.getArrival().getIataCode();
                String carrierCode = segment.getCarrierCode();
                String aircraftCode = segment.getAircraft().getCode();
                String operatingCarrierCode = segment.getOperating() != null ? segment.getOperating().getCarrierCode() : null;

                if (cachedDictionaries.getLocations().containsKey(departureIataCode)) {
                    usedDictionaries.getLocations().put(departureIataCode, cachedDictionaries.getLocations().get(departureIataCode));
                }
                if (cachedDictionaries.getLocations().containsKey(arrivalIataCode)) {
                    usedDictionaries.getLocations().put(arrivalIataCode, cachedDictionaries.getLocations().get(arrivalIataCode));
                }

                if (cachedDictionaries.getCarriers().containsKey(carrierCode)) {
                    usedDictionaries.getCarriers().put(carrierCode, cachedDictionaries.getCarriers().get(carrierCode));
                }

                if (operatingCarrierCode != null && cachedDictionaries.getCarriers().containsKey(operatingCarrierCode)) {
                    usedDictionaries.getCarriers().put(operatingCarrierCode, cachedDictionaries.getCarriers().get(operatingCarrierCode));
                }

                if (cachedDictionaries.getAircraft().containsKey(aircraftCode)) {
                    usedDictionaries.getAircraft().put(aircraftCode, cachedDictionaries.getAircraft().get(aircraftCode));
                }
            });
        });

        return usedDictionaries;
    }
}
