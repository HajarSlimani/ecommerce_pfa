package com.ecommerce.auth;

import com.ecommerce.common.enums.Role;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.panier.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CartService cartService;

    public AuthResponse register(RegisterRequest request, String guestCartId) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un compte existe déjà avec cet email");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.CLIENT)
                .build();

        userRepository.save(user);
        cartService.mergeGuestCartIntoUser(guestCartId, user.getId());

        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    /**
     * Vérification directe du mot de passe (plutôt que de passer par
     * AuthenticationManager/DaoAuthenticationProvider) : plus simple, plus
     * prévisible, et évite les subtilités de câblage Spring Security autour
     * du AuthenticationManagerBuilder global vs celui de HttpSecurity —
     * inutiles de toute façon pour une API stateless en JWT.
     */
    public AuthResponse login(LoginRequest request, String guestCartId) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect");
        }

        cartService.mergeGuestCartIntoUser(guestCartId, user.getId());

        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}
