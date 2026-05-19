package com.evolucao.treinos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutRequestDTO {
    private String name;
    private String sportType;
    private LocalDate date;
    private Long userId;
}
