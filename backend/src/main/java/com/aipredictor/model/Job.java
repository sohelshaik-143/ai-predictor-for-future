package com.aipredictor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    private String title;
    private String company;
    private String city;
    private String state;
    private String category;       // construction, delivery, textile, it, hospitality, other
    private String type;           // full-time, part-time, gig, contract
    private String pay;            // e.g. "₹500-700/day"
    private String hours;          // e.g. "8 hrs/day"
    private String description;
    private String contactPhone;
    private String contactEmail;
    private String contactWhatsapp;
    private List<String> skills;   // required skills
    private String experience;     // e.g. "0-2 years"
    private String language;       // posting language: en, hi, te, ta, etc.
    private String postedBy;       // email of poster
    private boolean active;        // admin can toggle
    private boolean featured;      // pinned/featured
    private Instant createdAt;
    private Instant updatedAt;
    private Instant expiresAt;     // auto-expire date

    public Job() {
        this.active = true;
        this.featured = false;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPay() { return pay; }
    public void setPay(String pay) { this.pay = pay; }

    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactWhatsapp() { return contactWhatsapp; }
    public void setContactWhatsapp(String contactWhatsapp) { this.contactWhatsapp = contactWhatsapp; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
