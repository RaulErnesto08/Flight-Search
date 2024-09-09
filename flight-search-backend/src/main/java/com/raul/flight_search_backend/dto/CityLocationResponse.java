package com.raul.flight_search_backend.dto;

import lombok.Data;

@Data
public class CityLocationResponse {
    private AirportAndCitySearchResponse.Meta meta;
    private LocationData data;

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

        private AirportAndCitySearchResponse.LocationData.Address address;

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
