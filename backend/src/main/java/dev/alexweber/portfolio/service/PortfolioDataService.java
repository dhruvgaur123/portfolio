package dev.alexweber.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

/**
 * Serves portfolio content from classpath JSON. This is deliberately a thin
 * repository seam: replacing it with a Spring Data JPA repository backed by
 * PostgreSQL later requires no controller changes.
 */
@Service
public class PortfolioDataService {

    private final ObjectMapper mapper;
    private final Map<String, JsonNode> cache = new ConcurrentHashMap<>();

    public PortfolioDataService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    void preload() {
        for (String name : new String[]{"profile", "projects", "skills", "experience"}) {
            cache.put(name, load(name));
        }
    }

    public JsonNode get(String name) {
        return cache.get(name);
    }

    private JsonNode load(String name) {
        try {
            return mapper.readTree(new ClassPathResource("data/" + name + ".json").getInputStream());
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load data/" + name + ".json", e);
        }
    }
}
