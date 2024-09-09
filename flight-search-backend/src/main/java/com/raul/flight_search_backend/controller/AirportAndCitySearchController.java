package com.raul.flight_search_backend.controller;

import com.raul.flight_search_backend.dto.AirportAndCitySearchRequest;
import com.raul.flight_search_backend.dto.AirportAndCitySearchResponse;
import com.raul.flight_search_backend.service.AirportAndCitySearchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/airport-and-city")
public class AirportAndCitySearchController {

    @Autowired
    private AirportAndCitySearchService airportAndCitySearchService;

    @GetMapping("/search")
    public AirportAndCitySearchResponse searchAirportsAndCity(@Valid @RequestParam String subType,
                                                              @Valid @RequestParam String keyword,
                                                              @RequestParam(required = false) String countryCode,
                                                              @RequestParam(required = false, defaultValue = "10") Integer limit,
                                                              @RequestParam(required = false, defaultValue = "0") Integer offset,
                                                              @RequestParam(required = false, defaultValue = "analytics.travelers.score") String sort,
                                                              @RequestParam(required = false, defaultValue = "FULL") String view) {

        AirportAndCitySearchRequest request = new AirportAndCitySearchRequest();

        request.setSubType(subType);
        request.setKeyword(keyword);
        request.setCountryCode(countryCode);
        request.setLimit(limit);
        request.setOffset(offset);
        request.setSort(sort);
        request.setView(view);

        return airportAndCitySearchService.searchAirportAndCity(request);
    }
}
