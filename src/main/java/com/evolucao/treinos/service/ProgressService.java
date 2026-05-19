package com.evolucao.treinos.service;

import com.evolucao.treinos.dto.EvolutionSummaryDTO;
import com.evolucao.treinos.dto.ProgressRequestDTO;
import com.evolucao.treinos.dto.ProgressResponseDTO;
import com.evolucao.treinos.model.Progress;
import com.evolucao.treinos.model.User;
import com.evolucao.treinos.repository.ProgressRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserService userService;

    public ProgressResponseDTO create(ProgressRequestDTO dto) {
        User user = userService.findEntityById(dto.getUserId());

        Progress progress = new Progress();
        BeanUtils.copyProperties(dto, progress);
        progress.setUser(user);

        Progress savedProgress = progressRepository.save(progress);
        return convertToDTO(savedProgress);
    }

    public List<ProgressResponseDTO> findByUserId(Long userId) {
        return progressRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EvolutionSummaryDTO getEvolutionSummary(Long userId) {
        List<Progress> history = progressRepository.findByUserIdOrderByDateDesc(userId);

        if (history.size() < 2) {
            return new EvolutionSummaryDTO(0.0, 0.0, 0.0, "Registre pelo menos dois pontos de progresso para ver a evolução.");
        }

        Progress current = history.get(0); // Mais recente (devido ao OrderByDesc)
        Progress initial = history.get(history.size() - 1); // Mais antigo

        Double diff = current.getWeight() - initial.getWeight();
        String message = diff > 0 ? "Você ganhou " + diff + "kg." : "Você perdeu " + Math.abs(diff) + "kg.";
        
        if (diff == 0) message = "Seu peso se manteve estável.";

        return new EvolutionSummaryDTO(
                initial.getWeight(),
                current.getWeight(),
                diff,
                message
        );
    }

    public void delete(Long id) {
        progressRepository.deleteById(id);
    }

    private ProgressResponseDTO convertToDTO(Progress progress) {
        ProgressResponseDTO dto = new ProgressResponseDTO();
        BeanUtils.copyProperties(progress, dto);
        dto.setUserId(progress.getUser().getId());
        return dto;
    }
}
