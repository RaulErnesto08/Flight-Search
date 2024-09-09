package com.raul.flight_search_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class AirportAndCitySearchRequest {

    @NotNull
    private String subType;

    @NotBlank
    private String keyword;

    private String countryCode;
    private Integer limit;
    private Integer offset;
    private String sort;
    private String view;
}
