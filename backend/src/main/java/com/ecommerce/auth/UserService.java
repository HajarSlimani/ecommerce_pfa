package com.ecommerce.auth;

import com.ecommerce.auth.dto.ChangePasswordRequest;
import com.ecommerce.auth.dto.UpdateProfileRequest;
import com.ecommerce.auth.dto.UserDTO;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getProfile(Long userId) {
        return toDTO(findUser(userId));
    }

    /** Vue admin : liste de tous les utilisateurs (lecture seule pour l'instant). */
    public com.ecommerce.common.dto.PageResponse<UserDTO> getAllUsers(org.springframework.data.domain.Pageable pageable) {
        return com.ecommerce.common.dto.PageResponse.from(userRepository.findAll(pageable), this::toDTO);
    }

    @Transactional
    public UserDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUser(userId);
        user.setFullName(request.getFullName());
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findUser(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Mot de passe actuel incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + userId));
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
