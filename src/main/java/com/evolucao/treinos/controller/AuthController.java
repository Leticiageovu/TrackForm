package com.evolucao.treinos.controller;

import com.evolucao.treinos.dto.LoginRequestDTO;
import com.evolucao.treinos.dto.LoginResponseDTO;
import com.evolucao.treinos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final com.evolucao.treinos.service.UserService userService;

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);
        
        com.evolucao.treinos.model.User user = userService.findEntityByEmail(request.getEmail());
        
        return new LoginResponseDTO(
            token,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getGender(),
            user.getPreferredSports(),
            user.getWeeklyGoal(),
            userService.findCustomSportsByUserId(user.getId())
        );
    }
}
