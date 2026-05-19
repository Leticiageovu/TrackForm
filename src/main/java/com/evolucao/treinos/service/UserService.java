package com.evolucao.treinos.service;

import com.evolucao.treinos.dto.UserRequestDTO;
import com.evolucao.treinos.dto.UserResponseDTO;
import com.evolucao.treinos.model.User;
import com.evolucao.treinos.repository.UserRepository;
import com.evolucao.treinos.repository.CustomSportRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomSportRepository customSportRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserResponseDTO create(UserRequestDTO dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public User findEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public UserResponseDTO findById(Long id) {
        return convertToDTO(findEntityById(id));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public UserResponseDTO updatePreferredSports(Long id, java.util.Set<String> sports) {
        User user = findEntityById(id);
        user.setPreferredSports(sports);
        return convertToDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO saveCustomSports(Long userId, List<UserResponseDTO.CustomSportDTO> customSports) {
        User user = findEntityById(userId);
        
        List<com.evolucao.treinos.model.CustomSport> existing = customSportRepository.findByUserId(userId);
        customSportRepository.deleteAll(existing);

        List<com.evolucao.treinos.model.CustomSport> toSave = customSports.stream().map(dto -> {
            com.evolucao.treinos.model.CustomSport entity = new com.evolucao.treinos.model.CustomSport();
            entity.setName(dto.getName());
            entity.setIcon(dto.getIcon());
            entity.setUser(user);
            return entity;
        }).collect(Collectors.toList());

        customSportRepository.saveAll(toSave);
        return convertToDTO(user);
    }

    public List<UserResponseDTO.CustomSportDTO> findCustomSportsByUserId(Long userId) {
        return customSportRepository.findByUserId(userId).stream()
                .map(entity -> new UserResponseDTO.CustomSportDTO(entity.getName(), entity.getIcon()))
                .collect(Collectors.toList());
    }

    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        BeanUtils.copyProperties(user, dto);
        dto.setCustomSports(findCustomSportsByUserId(user.getId()));
        return dto;
    }
}
