package dev.dhurvgaur.portfolio.service;

import dev.alexweber.portfolio.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactMailService {

    private static final Logger log = LoggerFactory.getLogger(ContactMailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.contact.recipient}")
    private String recipient;

    @Value("${spring.mail.username}")
    private String from;

    public ContactMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(ContactRequest request) {
        var mail = new SimpleMailMessage();
        mail.setTo(recipient);
        mail.setFrom(from);
        mail.setReplyTo(request.email());
        mail.setSubject("[Portfolio] " + request.subject());
        mail.setText("""
            New message from your portfolio contact form.

            Name:  %s
            Email: %s

            %s
            """.formatted(request.name(), request.email(), request.message()));
        mailSender.send(mail);
        log.info("Contact mail forwarded (reply-to: {})", request.email());
    }
}
