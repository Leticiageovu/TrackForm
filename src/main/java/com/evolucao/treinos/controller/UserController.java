package com.evolucao.treinos.controller;

import com.evolucao.treinos.dto.UserResponseDTO;
import com.evolucao.treinos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@RequestBody com.evolucao.treinos.dto.UserRequestDTO dto) {
        return ResponseEntity.ok(userService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/sports")
    public ResponseEntity<UserResponseDTO> updateSports(@PathVariable Long id, @RequestBody java.util.Set<String> sports) {
        return ResponseEntity.ok(userService.updatePreferredSports(id, sports));
    }

    @PostMapping("/{id}/custom-sports")
    public ResponseEntity<UserResponseDTO> updateCustomSports(@PathVariable Long id, @RequestBody List<UserResponseDTO.CustomSportDTO> customSports) {
        return ResponseEntity.ok(userService.saveCustomSports(id, customSports));
    }
}
