package com.example;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BookingDates {
    @JsonProperty
    private Date checkin;

    @JsonProperty
    private Date checkout;

}
