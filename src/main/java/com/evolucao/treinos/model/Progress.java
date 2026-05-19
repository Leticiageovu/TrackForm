package com.evolucao.treinos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "physical_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double weight;

    private Double height;

    @Column(name = "bmi")
    private Double bmi;

    @Column(name = "muscle_mass_percentage")
    private Double muscleMassPercentage;

    // Novas medidas corporais (em cm)
    private Double chest;
    private Double shoulders;
    private Double leftBiceps;
    private Double rightBiceps;
    private Double waist;
    private Double abdomen;
    private Double hips;
    private Double leftThigh;
    private Double rightThigh;
    private Double leftCalf;
    private Double rightCalf;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
