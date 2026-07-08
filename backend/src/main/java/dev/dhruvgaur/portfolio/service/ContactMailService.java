package dev.dhruvgaur.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.dhruvgaur.portfolio.dto.ContactRequest;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Sends contact-form mail via the Resend HTTP API instead of raw SMTP.
 * Most free hosting tiers (Render included) block outbound SMTP ports as an
 * anti-spam measure, but HTTPS is always open, so an HTTP-based provider is
 * the reliable choice for a platform-hosted backend.
 */
@Service
public class ContactMailService {

    private static final Logger log = LoggerFactory.getLogger(ContactMailService.class);
    private static final URI RESEND_ENDPOINT = URI.create("https://api.resend.com/emails");

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper mapper;

    @Value("${app.contact.recipient}")
    private String recipient;

    @Value("${app.resend.api-key}")
    private String apiKey;

    @Value("${app.resend.from}")
    private String from;

    public ContactMailService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public void send(ContactRequest request) {
        try {
            String body = mapper.writeValueAsString(Map.of(
                    "from", from,
                    "to", recipient,
                    "reply_to", request.email(),
                    "subject", "[Portfolio] " + request.subject(),
                    "text", """
                    New message from your portfolio contact form.

                    Name:  %s
                    Email: %s

                    %s
                    """.formatted(request.name(), request.email(), request.message())
            ));

            HttpRequest httpRequest = HttpRequest.newBuilder(RESEND_ENDPOINT)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = http.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                throw new IllegalStateException("Resend API returned " + response.statusCode() + ": " + response.body());
            }
            log.info("Contact mail sent via Resend (reply-to: {})", request.email());
        } catch (Exception e) {
            throw new MailDeliveryException("Failed to send contact mail", e);
        }
    }
}