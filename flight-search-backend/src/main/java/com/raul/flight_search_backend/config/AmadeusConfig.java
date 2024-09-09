package com.raul.flight_search_backend.config;

import com.raul.flight_search_backend.service.AmadeusAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.Map;

@Configuration
public class AmadeusConfig {

    @Autowired
    private AmadeusAuthService amadeusAuthService;

    @Value("${amadeus.api.key}")
    private String apiKey;

    @Value("${amadeus.api.secret}")
    private String apiSecret;

    private String bearerToken;
    private Instant tokenExpireTime;

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {
            if (bearerToken == null || Instant.now().isAfter(tokenExpireTime)) {
                refreshBearerToken();
            }
            request.getHeaders().setBearerAuth(bearerToken);
            return execution.execute(request, body);
        };
        restTemplate.setInterceptors(Collections.singletonList(interceptor));
        return restTemplate;
    }

    private synchronized void refreshBearerToken() {
        Map<String, Object> tokenResponse = amadeusAuthService.getBearerToken(apiKey, apiSecret);
        bearerToken = (String) tokenResponse.get("access_token");
        int expiresIn = (int) tokenResponse.get("expires_in");
        tokenExpireTime = Instant.now().plusSeconds(expiresIn);
    }
}