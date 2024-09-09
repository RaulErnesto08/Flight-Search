package com.raul.flight_search_backend.service;

import com.raul.flight_search_backend.dto.AirportAndCitySearchRequest;
import com.raul.flight_search_backend.dto.AirportAndCitySearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class AirportAndCitySearchService {

    @Autowired
    private RestTemplate restTemplate;

    public AirportAndCitySearchResponse searchAirportAndCity(AirportAndCitySearchRequest request) {
        String referenceUrl = "reference-data/locations";
        String url = UriComponentsBuilder.fromHttpUrl("https://test.api.amadeus.com/v1/" + referenceUrl)
                .queryParam("subType", request.getSubType())
                .queryParam("keyword", request.getKeyword())
                .encode()
                .toUriString();

        System.out.println("URL: " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.amadeus+json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<AirportAndCitySearchResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, AirportAndCitySearchResponse.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.err.println("Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch data from API: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }

}
