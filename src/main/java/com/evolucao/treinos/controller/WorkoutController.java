package com.evolucao.treinos.controller;

import com.evolucao.treinos.dto.WorkoutRequestDTO;
import com.evolucao.treinos.dto.WorkoutResponseDTO;
import com.evolucao.treinos.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutResponseDTO> create(@RequestBody WorkoutRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.create(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutResponseDTO>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(workoutService.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
