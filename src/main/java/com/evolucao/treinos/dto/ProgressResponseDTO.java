package com.evolucao.treinos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponseDTO {
    private Long id;
    private Double weight;
    private Double height;
    private Double bmi;
    private Double muscleMassPercentage;
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
    private LocalDate date;
    private Long userId;
}
