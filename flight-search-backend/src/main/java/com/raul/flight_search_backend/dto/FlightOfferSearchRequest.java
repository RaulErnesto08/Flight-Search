package com.raul.flight_search_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FlightOfferSearchRequest {

    @NotBlank
    private String originLocationCode;

    @NotBlank
    private String destinationLocationCode;

    @NotBlank
    private String departureDate;

    private String returnDate;

    @NotBlank
    private String currency;

    @NotBlank
    private int adults;

    private boolean nonStop;
}
