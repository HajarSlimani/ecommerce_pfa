package com.ecommerce.pricing.client;

import com.ecommerce.pricing.dto.PricingDecisionResponse;
import com.ecommerce.pricing.dto.PricingSignalsRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class PricingMLClient {

    private final WebClient pricingWebClient;

    /**
     * Appelle POST /pricing/compute sur le microservice FastAPI.
     * Retry léger en cas d'échec transitoire (le microservice ML peut être
     * temporairement indisponible sans bloquer tout le flux e-commerce).
     */
    public Mono<PricingDecisionResponse> computePrice(PricingSignalsRequest request) {
        return pricingWebClient.post()
                .uri("/pricing/compute")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PricingDecisionResponse.class)
                .retryWhen(Retry.backoff(2, Duration.ofMillis(500)))
                .doOnError(err -> log.error("Échec appel microservice pricing pour productId={} grade={} : {}",
                        request.getProductId(), request.getGrade(), err.getMessage()));
    }
}
