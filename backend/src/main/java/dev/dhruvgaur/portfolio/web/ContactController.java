package dev.dhurvgaur.portfolio.web;

import dev.alexweber.portfolio.dto.ContactRequest;
import dev.dhurvgaur.portfolio.exception.RateLimitExceededException;
import dev.dhurvgaur.portfolio.service.ContactMailService;
import dev.dhurvgaur.portfolio.service.RateLimitService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactMailService mailService;
    private final RateLimitService rateLimit;

    public ContactController(ContactMailService mailService, RateLimitService rateLimit) {
        this.mailService = mailService;
        this.rateLimit = rateLimit;
    }

    @Operation(summary = "Send a contact message (validated, rate limited, honeypot spam check)")
    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactRequest request,
                                                      HttpServletRequest http) {
        String clientIp = clientIp(http);
        if (!rateLimit.tryAcquire(clientIp)) {
            throw new RateLimitExceededException("Too many messages. Please try again later.");
        }
        // Honeypot triggered: pretend success so bots learn nothing. Validation
        // already rejects non-empty values; this guards a null-bypass variant.
        if (request.website() != null && !request.website().isBlank()) {
            log.warn("Honeypot triggered from {}", clientIp);
            return ResponseEntity.ok(Map.of("status", "sent"));
        }
        // CAPTCHA placeholder: verify a reCAPTCHA/Turnstile token here before sending.
        mailService.send(request);
        return ResponseEntity.ok(Map.of("status", "sent"));
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return forwarded != null ? forwarded.split(",")[0].trim() : request.getRemoteAddr();
    }
}
