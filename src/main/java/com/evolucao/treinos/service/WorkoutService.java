package com.evolucao.treinos.service;

import com.evolucao.treinos.dto.WorkoutRequestDTO;
import com.evolucao.treinos.dto.WorkoutResponseDTO;
import com.evolucao.treinos.model.User;
import com.evolucao.treinos.model.Workout;
import com.evolucao.treinos.repository.WorkoutRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserService userService;

    public WorkoutResponseDTO create(WorkoutRequestDTO dto) {
        User user = userService.findEntityById(dto.getUserId());
        
        Workout workout = new Workout();
        BeanUtils.copyProperties(dto, workout);
        workout.setUser(user);
        
        Workout savedWorkout = workoutRepository.save(workout);
        return convertToDTO(savedWorkout);
    }

    public List<WorkoutResponseDTO> findByUserId(Long userId) {
        return workoutRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WorkoutResponseDTO findById(Long id) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));
        return convertToDTO(workout);
    }

    public void delete(Long id) {
        workoutRepository.deleteById(id);
    }

    private WorkoutResponseDTO convertToDTO(Workout workout) {
        WorkoutResponseDTO dto = new WorkoutResponseDTO();
        BeanUtils.copyProperties(workout, dto);
        dto.setUserId(workout.getUser().getId());
        return dto;
    }

    public Workout findEntityById(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));
    }
}
