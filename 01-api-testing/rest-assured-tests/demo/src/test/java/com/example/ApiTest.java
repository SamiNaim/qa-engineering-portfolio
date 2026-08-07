package com.example;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

import org.junit.jupiter.api.Test;

import io.restassured.RestAssured;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.Header;
import io.restassured.response.Response;

public class ApiTest {
    @Test
    public void myFirstRaTest() {
        assertThat(RestAssured.config(), instanceOf(RestAssuredConfig.class));
    }

    @Test
    public void basicGetRequest() {
        Response response = RestAssured.given().get("https://restful-booker.herokuapp.com/ping/");
        int statusCode = response.getStatusCode();

        assertThat(statusCode, is(201));
    }

    @Test
    public void basicHeaderRequest() {
        Header acceptHeader = new Header("accept", "application/json");

        Response response = RestAssured.given()
                .header(acceptHeader)
                .get("https://restful-booker.herokuapp.com/booking/1");

        int statusCode = response.getStatusCode();

        assertThat(statusCode, is(200));
    }

    @Test
    public void basicResponseBody() {
        Response response = RestAssured.given().get("https://restful-booker.herokuapp.com/booking/3");
        BookingResponse responseBody = response.as(BookingResponse.class);
        String additionalneeds = responseBody.getAdditionalneeds();

        assertThat(additionalneeds, is("Breakfast"));
    }

    @Test
    public void basicPayload() {
        AuthPayload authPayload = new AuthPayload("admin", "password123");

        Response response = RestAssured.given()
                                .body(authPayload)
                                .contentType("application/json")
                                .post("https://restful-booker.herokuapp.com/auth");

        String authResponse = response.getBody().print();

        assertThat(authResponse, containsString("token"));
    }
}
