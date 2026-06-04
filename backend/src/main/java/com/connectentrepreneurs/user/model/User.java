package com.connectentrepreneurs.user.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")

public class User {
	
	@Id

    private String id;
    private String name;
    private String sector;
    private List<String> skills;
    private String need;
    private String location;
    private String role;

    public User() {}

    public User(String id, String name, String sector,
                List<String> skills,
                String need,
                String location,String role) {

        this.id = id;
        this.name = name;
        this.sector = sector;
        this.skills = skills;
        this.need = need;
        this.location = location;
        this.role = role;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getSector() { return sector; }
    public List<String> getSkills() { return skills; }
    public String getNeed() { return need; }
    public String getLocation() { return location; }
    public String getRole() {
        return role;
    }
}