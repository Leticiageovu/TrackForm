package com.evolucao.treinos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvolutionSummaryDTO {
    private Double initialWeight;
    private Double currentWeight;
    private Double weightDifference;
    private String message;
}
