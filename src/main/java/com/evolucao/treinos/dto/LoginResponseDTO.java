package com.evolucao.treinos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String gender;
    private java.util.Set<String> preferredSports;
    private Integer weeklyGoal;
    private java.util.List<UserResponseDTO.CustomSportDTO> customSports;

    public LoginResponseDTO(String token) {
        this.token = token;
    }
}
