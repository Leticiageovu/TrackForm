package com.evolucao.treinos.controller;

import com.evolucao.treinos.dto.ExerciseRequestDTO;
import com.evolucao.treinos.dto.ExerciseResponseDTO;
import com.evolucao.treinos.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @PostMapping
    public ResponseEntity<ExerciseResponseDTO> create(@RequestBody ExerciseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseService.create(dto));
    }

    @GetMapping("/workout/{workoutId}")
    public ResponseEntity<List<ExerciseResponseDTO>> findByWorkoutId(@PathVariable Long workoutId) {
        return ResponseEntity.ok(exerciseService.findByWorkoutId(workoutId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        exerciseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
