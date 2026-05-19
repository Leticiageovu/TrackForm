package com.evolucao.treinos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String gender;
    private java.util.Set<String> preferredSports;
    private Integer weeklyGoal;
    private java.util.List<CustomSportDTO> customSports;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomSportDTO {
        private String name;
        private String icon;
    }
}
