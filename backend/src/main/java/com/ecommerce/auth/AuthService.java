package com.ecommerce.auth;

import com.ecommerce.common.enums.Role;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.panier.service.CartService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CartService cartService;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    private GoogleIdTokenVerifier googleVerifier;

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

    /**
     * Connexion via Google. Le front envoie le "ID token" obtenu par Google
     * Identity Services (jamais le mot de passe Google, qui ne transite pas
     * par notre backend) — on vérifie sa signature et son audience (notre
     * Client ID) directement auprès de Google, puis on associe le compte par
     * email : s'il existe déjà (créé via inscription classique ou une
     * précédente connexion Google), on se connecte dessus ; sinon on le crée
     * avec un mot de passe aléatoire inutilisable (l'utilisateur ne se
     * connectera jamais autrement que via Google, sauf s'il utilise plus
     * tard "mot de passe oublié" — non implémenté pour l'instant).
     */
    public AuthResponse loginWithGoogle(GoogleLoginRequest request, String guestCartId) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new BadRequestException("Connexion Google non configurée côté serveur (GOOGLE_CLIENT_ID manquant)");
        }

        GoogleIdToken.Payload payload = verifyGoogleIdToken(request.getIdToken());

        String email = payload.getEmail();
        if (email == null || !Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new BadCredentialsException("Email Google non vérifié");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Object name = payload.get("name");
            User newUser = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .fullName(name != null ? name.toString() : email)
                    .role(Role.CLIENT)
                    .build();
            return userRepository.save(newUser);
        });

        cartService.mergeGuestCartIntoUser(guestCartId, user.getId());

        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
        try {
            if (googleVerifier == null) {
                googleVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                        .setAudience(Collections.singletonList(googleClientId))
                        .build();
            }
            GoogleIdToken idToken = googleVerifier.verify(idTokenString);
            if (idToken == null) {
                throw new BadCredentialsException("Jeton Google invalide ou expiré");
            }
            return idToken.getPayload();
        } catch (BadCredentialsException e) {
            throw e;
        } catch (Exception e) {
            throw new BadCredentialsException("Impossible de vérifier le jeton Google");
        }
    }
}
