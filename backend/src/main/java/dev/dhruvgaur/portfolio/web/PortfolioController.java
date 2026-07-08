package dev.dhruvgaur.portfolio.web;

import com.fasterxml.jackson.databind.JsonNode;
import dev.dhruvgaur.portfolio.service.PortfolioDataService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    private final PortfolioDataService data;

    public PortfolioController(PortfolioDataService data) {
        this.data = data;
    }

    @Operation(summary = "Profile, hero content and social links")
    @GetMapping("/profile")
    public JsonNode profile() { return data.get("profile"); }

    @Operation(summary = "All projects with categories, tech stacks and case-study details")
    @GetMapping("/projects")
    public JsonNode projects() { return data.get("projects"); }

    @Operation(summary = "Skill categories with proficiency levels")
    @GetMapping("/skills")
    public JsonNode skills() { return data.get("skills"); }

    @Operation(summary = "Work experience timeline")
    @GetMapping("/experience")
    public JsonNode experience() { return data.get("experience"); }
}
