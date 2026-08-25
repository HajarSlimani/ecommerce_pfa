package com.ecommerce.auth;

import com.ecommerce.auth.dto.ChangePasswordRequest;
import com.ecommerce.auth.dto.UpdateProfileRequest;
import com.ecommerce.auth.dto.UpdateUserRequest;
import com.ecommerce.auth.dto.UserDTO;
import com.ecommerce.commande.repository.OrderRepository;
import com.ecommerce.common.enums.Role;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.panier.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getProfile(Long userId) {
        return toDTO(findUser(userId));
    }

    /** Vue admin : liste de tous les utilisateurs. */
    public com.ecommerce.common.dto.PageResponse<UserDTO> getAllUsers(org.springframework.data.domain.Pageable pageable) {
        return com.ecommerce.common.dto.PageResponse.from(userRepository.findAll(pageable), this::toDTO);
    }

    /**
     * Édition admin (nom + rôle) d'un autre utilisateur. Un admin ne peut
     * pas se rétrograder lui-même — sinon un admin seul sur le système
     * pourrait accidentellement se couper l'accès au panel admin.
     */
    @Transactional
    public UserDTO updateUser(Long adminId, Long targetUserId, UpdateUserRequest request) {
        if (adminId.equals(targetUserId) && request.getRole() != Role.ADMIN) {
            throw new BadRequestException("Vous ne pouvez pas retirer votre propre rôle admin");
        }

        User user = findUser(targetUserId);
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        return toDTO(userRepository.save(user));
    }

    /**
     * Suppression admin. Deux garde-fous : impossible de se supprimer
     * soi-même, et impossible de supprimer un utilisateur qui a des
     * commandes (ça casserait l'historique). Le panier (s'il existe) est
     * bien supprimé, lui, puisqu'il n'a aucune valeur historique.
     */
    @Transactional
    public void deleteUser(Long adminId, Long targetUserId) {
        if (adminId.equals(targetUserId)) {
            throw new BadRequestException("Vous ne pouvez pas supprimer votre propre compte");
        }

        User user = findUser(targetUserId);

        if (orderRepository.countByUserId(targetUserId) > 0) {
            throw new BadRequestException(
                    "Impossible de supprimer un utilisateur ayant des commandes — ça casserait l'historique");
        }

        cartRepository.findByUserId(targetUserId).ifPresent(cartRepository::delete);
        userRepository.delete(user);
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
                .emailVerified(user.isEmailVerified())
                .build();
    }
}
