package com.evolucao.treinos.service;

import com.evolucao.treinos.dto.ExerciseRequestDTO;
import com.evolucao.treinos.dto.ExerciseResponseDTO;
import com.evolucao.treinos.model.Exercise;
import com.evolucao.treinos.model.Workout;
import com.evolucao.treinos.repository.ExerciseRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private WorkoutService workoutService;

    public ExerciseResponseDTO create(ExerciseRequestDTO dto) {
        Workout workout = workoutService.findEntityById(dto.getWorkoutId());

        Exercise exercise = new Exercise();
        BeanUtils.copyProperties(dto, exercise);
        exercise.setWorkout(workout);

        Exercise savedExercise = exerciseRepository.save(exercise);
        return convertToDTO(savedExercise);
    }

    public List<ExerciseResponseDTO> findByWorkoutId(Long workoutId) {
        return exerciseRepository.findByWorkoutId(workoutId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        exerciseRepository.deleteById(id);
    }

    private ExerciseResponseDTO convertToDTO(Exercise exercise) {
        ExerciseResponseDTO dto = new ExerciseResponseDTO();
        BeanUtils.copyProperties(exercise, dto);
        dto.setWorkoutId(exercise.getWorkout().getId());
        return dto;
    }
}
