package com.raul.flight_search_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FlightOfferSearchResponse {
    private Meta meta;
    private List<FlightOffer> data;
    private Dictionaries dictionaries;

    @Data
    public static class Meta {
        private int count;
        private Links links;
    }

    @Data
    public static class Links {
        private String self;
    }

    @Data
    public static class FlightOffer {
        private String type;
        private String id;
        private String source;
        private boolean instantTicketingRequired;
        private boolean nonHomogeneous;
        private boolean oneWay;
        private String lastTicketingDate;
        private int numberOfBookableSeats;
        private List<Itinerary> itineraries;
        private Price price;
        private PricingOptions pricingOptions;
        private List<String> validatingAirlineCodes;
        private List<TravelerPricing> travelerPricings;
    }

    @Data
    public static class Itinerary {
        private String duration;
        private List<Segment> segments;
    }

    @Data
    public static class Segment {
        private Departure departure;
        private Arrival arrival;
        private String carrierCode;
        private String number;
        private Aircraft aircraft;
        private Operating operating;
        private String duration;
        private String id;
        private int numberOfStops;
        private boolean blacklistedInEU;
    }

    @Data
    public static class Departure {
        private String iataCode;
        private String terminal;
        private String at;
    }

    @Data
    public static class Arrival {
        private String iataCode;
        private String terminal;
        private String at;
    }

    @Data
    public static class Aircraft {
        private String code;
    }

    @Data
    public static class Operating {
        private String carrierCode;
    }

    @Data
    public static class Price {
        private String currency;
        private String total;
        private String base;
        private List<Fee> fees;
        private String grandTotal;
    }

    @Data
    public static class Fee {
        private String amount;
        private String type;
    }

    @Data
    public static class PricingOptions {
        private List<String> fareType;
        private boolean includedCheckedBagsOnly;
    }

    @Data
    public static class TravelerPricing {
        private String travelerId;
        private String fareOption;
        private String travelerType;
        private Price price;
        private List<FareDetailsBySegment> fareDetailsBySegment;
    }

    @Data
    public static class FareDetailsBySegment {
        private String segmentId;
        private String cabin;
        private String fareBasis;
        private String brandedFare;
        private String brandedFareLabel;

        @JsonProperty("class")
        private String classType;

        private IncludedCheckedBags includedCheckedBags;
        private List<Amenities> amenities;
    }

    @Data
    public static class IncludedCheckedBags {
        private int weight;
        private String weightUnit;
        private Integer quantity;
    }

    @Data
    public static class Amenities {
        private String description;
        private boolean isChargeable;
        private String amenityType;
        private AmenityProvider amenityProvider;
    }

    @Data
    public static  class AmenityProvider {
        private String name;
    }

    @Data
    public static class Dictionaries {
        private Map<String, Location> locations;
        private Map<String, String> aircraft;
        private Map<String, String> currencies;
        private Map<String, String> carriers;
    }

    @Data
    public static class Location {
        private String cityCode;
        private String cityName;
        private String countryCode;
        private String countryName;
    }
}
