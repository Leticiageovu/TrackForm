package com.evolucao.treinos.controller;

import com.evolucao.treinos.dto.EvolutionSummaryDTO;
import com.evolucao.treinos.dto.ProgressRequestDTO;
import com.evolucao.treinos.dto.ProgressResponseDTO;
import com.evolucao.treinos.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @PostMapping
    public ResponseEntity<ProgressResponseDTO> create(@RequestBody ProgressRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(progressService.create(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressResponseDTO>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.findByUserId(userId));
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<EvolutionSummaryDTO> getSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getEvolutionSummary(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        progressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
