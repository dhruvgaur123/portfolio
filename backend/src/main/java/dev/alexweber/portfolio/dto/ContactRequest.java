package dev.alexweber.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Contact form payload. The "website" field is a honeypot: it is hidden in the
 * UI, so any non-empty value marks the submission as spam.
 */
public record ContactRequest(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email @Size(max = 254) String email,
    @NotBlank @Size(max = 150) String subject,
    @NotBlank @Size(min = 10, max = 5000) String message,
    @Size(max = 0, message = "Invalid submission") String website
) {}
