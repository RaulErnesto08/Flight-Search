package com.raul.flight_search_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class AirportAndCitySearchResponse {

    private Meta meta;
    private List<LocationData> data;

    @Data
    public static class Meta {
        private int count;
    }

    @Data
    public static class LocationData {
        private String type;
        private String subType;
        private String name;
        private String detailedName;
        private String id;
        private String iataCode;

        private Address address;

        @Data
        public static class Address {
            private String cityName;
            private String cityCode;
            private String countryName;
            private String countryCode;
            private String regionCode;
        }
    }
}