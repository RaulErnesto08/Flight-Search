package com.raul.flight_search_backend.service;

import com.raul.flight_search_backend.dto.CityLocationResponse;
import com.raul.flight_search_backend.dto.FlightOfferSearchRequest;
import com.raul.flight_search_backend.dto.FlightOfferSearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class FlightOfferSearchService {

    @Autowired
    private RestTemplate restTemplate;

    private FlightOfferSearchResponse lastCachedResponse;

    @Cacheable(value = "flightOffersCache", key = "#request")
    public FlightOfferSearchResponse searchFlights(FlightOfferSearchRequest request) {
        String referenceUrl = "shopping/flight-offers";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://test.api.amadeus.com/v2/" + referenceUrl)
                .queryParam("originLocationCode", request.getOriginLocationCode())
                .queryParam("destinationLocationCode", request.getDestinationLocationCode())
                .queryParam("departureDate", request.getDepartureDate())
                .queryParam("currencyCode", request.getCurrency())
                .queryParam("adults", request.getAdults())
                .queryParam("nonStop", request.isNonStop());

        if (request.getReturnDate() != null) {
            builder.queryParam("returnDate", request.getReturnDate());
        }

        String url = builder.encode().toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.amadeus+json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<FlightOfferSearchResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, FlightOfferSearchResponse.class);
            lastCachedResponse = response.getBody();

            FlightOfferSearchResponse.Dictionaries detailedDictionaries = appendLocationDetails(lastCachedResponse);
            cacheDictionaries(detailedDictionaries);

            return lastCachedResponse;
        } catch (HttpClientErrorException e) {
            System.err.println("Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch data from API: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }

    @Cacheable(value = "flightDictionaries", key = "'dictionaries'")
    public FlightOfferSearchResponse.Dictionaries cacheDictionaries(FlightOfferSearchResponse.Dictionaries dictionaries) {
        return dictionaries;
    }

    public FlightOfferSearchResponse getCachedResponse() {
        if (lastCachedResponse == null) {
            throw new RuntimeException("No cached search results");
        }
        return lastCachedResponse;
    }

    @CacheEvict(value = "flightDictionaries", key = "'dictionaries'")
    public void evictDictionaryCache() { }

    @CacheEvict(value = "flightOffersCache", allEntries = true)
    public void evictFlightOffersCache() { }

    private FlightOfferSearchResponse.Dictionaries appendLocationDetails(FlightOfferSearchResponse response) {

        if (response.getDictionaries() == null || response.getDictionaries().getLocations() == null) {
            return new FlightOfferSearchResponse.Dictionaries();
        }

        Map<String, FlightOfferSearchResponse.Location> locations = response.getDictionaries().getLocations();

        locations.forEach((iataCode, location) -> {
            if (location.getCityName() == null || location.getCountryName() == null) {
                CityLocationResponse.LocationData detailedLocation = getLocationDetails(iataCode);

                if (detailedLocation != null) {
                    location.setCityName(detailedLocation.getAddress().getCityName());
                    location.setCountryName(detailedLocation.getAddress().getCountryName());
                } else {
                    System.out.println("Location not found for IATA code: " + iataCode + ".");
                }
            }
        });

        return response.getDictionaries();
    }

    @Cacheable(value = "locationDetails", key = "#iataCode")
    private CityLocationResponse.LocationData getLocationDetails(String iataCode) {
        String locationId = "A" + iataCode;
        String url = UriComponentsBuilder.fromHttpUrl("https://test.api.amadeus.com/v1/reference-data/locations/" + locationId)
                .encode().toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.amadeus+json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<CityLocationResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, CityLocationResponse.class);

            if (response.hasBody() && response.getBody() != null) {
                return response.getBody().getData();
            } else {
                System.out.println("No data found for IATA code: " + iataCode);
                return null;
            }

        } catch (HttpClientErrorException e) {
            System.out.println("404 Error for IATA code: " + iataCode + " - No location found.");
            return null;
        }
    }

    public FlightOfferSearchResponse.Dictionaries getCachedDictionaries() {
        if(lastCachedResponse == null || lastCachedResponse.getDictionaries() == null) {
            return new FlightOfferSearchResponse.Dictionaries();
        }
        return lastCachedResponse.getDictionaries();
    }
}