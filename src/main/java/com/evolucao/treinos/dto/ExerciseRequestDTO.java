package com.evolucao.treinos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequestDTO {
    private String name;
    private Integer sets;
    private Integer repetitions;
    private Double weight;
    private Long workoutId;
}
