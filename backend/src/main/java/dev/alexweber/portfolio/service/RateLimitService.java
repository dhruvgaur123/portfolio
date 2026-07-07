package dev.alexweber.portfolio.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Simple in-memory sliding-window limiter, sufficient for a single instance.
 * Swap for a Redis/Bucket4j-backed implementation when scaling horizontally.
 */
@Service
public class RateLimitService {

    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    @Value("${app.contact.rate-limit.max-requests}")
    private int maxRequests;

    @Value("${app.contact.rate-limit.window-minutes}")
    private int windowMinutes;

    public boolean tryAcquire(String clientKey) {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(windowMinutes));
        Deque<Instant> window = hits.computeIfAbsent(clientKey, k -> new ArrayDeque<>());
        synchronized (window) {
            while (!window.isEmpty() && window.peekFirst().isBefore(cutoff)) {
                window.pollFirst();
            }
            if (window.size() >= maxRequests) return false;
            window.addLast(Instant.now());
            return true;
        }
    }

    @Scheduled(fixedDelay = 600_000)
    void evictStale() {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(windowMinutes));
        hits.entrySet().removeIf(e -> {
            synchronized (e.getValue()) {
                return e.getValue().isEmpty() || e.getValue().peekLast().isBefore(cutoff);
            }
        });
    }
}
