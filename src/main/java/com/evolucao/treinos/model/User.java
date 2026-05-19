package com.evolucao.treinos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String gender;

    @ElementCollection
    @CollectionTable(name = "user_preferred_sports", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "sport_id")
    private java.util.Set<String> preferredSports = new java.util.HashSet<>();

    private Integer weeklyGoal = 3; // Default goal

    @Column(nullable = false)
    private String password;
}
