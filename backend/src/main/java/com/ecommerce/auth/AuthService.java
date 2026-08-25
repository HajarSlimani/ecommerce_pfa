package com.ecommerce.auth;

import com.ecommerce.common.enums.Role;
import com.ecommerce.common.enums.TokenType;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    /**
     * Vérification d'email volontairement NON bloquante : un compte non
     * vérifié peut quand même se connecter (voir le champ emailVerified,
     * exposé au front via le JWT). Ça évite le risque de se retrouver
     * bloqué·e hors de son propre compte pendant les tests/la démo si
     * l'envoi d'email échoue ou n'est pas configuré — le front affiche
     * juste un bandeau "vérifie ton email" avec un bouton renvoyer.
     */
    private static final int EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
    private static final int PASSWORD_RESET_EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CartService cartService;
    private final EmailService emailService;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    private GoogleIdTokenVerifier googleVerifier;

    @Transactional
    public AuthResponse register(RegisterRequest request, String guestCartId) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un compte existe déjà avec cet email");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.CLIENT)
                .emailVerified(false)
                .build();

        userRepository.save(user);
        cartService.mergeGuestCartIntoUser(guestCartId, user.getId());
        sendVerificationEmail(user);

        String token = jwtService.generateToken(new UserPrincipal(user));
        return toAuthResponse(token, user);
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
        return toAuthResponse(token, user);
    }

    /**
     * Connexion via Google. Le front envoie le "ID token" obtenu par Google
     * Identity Services (jamais le mot de passe Google, qui ne transite pas
     * par notre backend) — on vérifie sa signature et son audience (notre
     * Client ID) directement auprès de Google, puis on associe le compte par
     * email : s'il existe déjà (créé via inscription classique ou une
     * précédente connexion Google), on se connecte dessus ; sinon on le crée
     * — email déjà vérifié par Google, pas besoin d'un second email de
     * vérification.
     */
    @Transactional
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
                    .emailVerified(true)
                    .build();
            return userRepository.save(newUser);
        });

        cartService.mergeGuestCartIntoUser(guestCartId, user.getId());

        String token = jwtService.generateToken(new UserPrincipal(user));
        return toAuthResponse(token, user);
    }

    @Transactional
    public void resendVerification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + userId));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Cet email est déjà vérifié");
        }

        sendVerificationEmail(user);
    }

    @Transactional
    public void verifyEmail(String tokenValue) {
        VerificationToken token = tokenRepository.findByTokenAndType(tokenValue, TokenType.EMAIL_VERIFICATION)
                .orElseThrow(() -> new BadRequestException("Lien de vérification invalide"));

        if (!token.isValid()) {
            throw new BadRequestException("Lien de vérification expiré ou déjà utilisé");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    /**
     * Toujours la même réponse (succès), que l'email existe en base ou pas
     * — sinon on permettrait à n'importe qui de deviner quels emails sont
     * inscrits juste en observant la différence de réponse (énumération de
     * comptes). Voir AuthController.
     */
    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            VerificationToken token = VerificationToken.builder()
                    .token(UUID.randomUUID().toString())
                    .userId(user.getId())
                    .type(TokenType.PASSWORD_RESET)
                    .expiresAt(Instant.now().plus(PASSWORD_RESET_EXPIRY_HOURS, ChronoUnit.HOURS))
                    .build();
            tokenRepository.save(token);
            emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
        });
    }

    @Transactional
    public void resetPassword(String tokenValue, String newPassword) {
        VerificationToken token = tokenRepository.findByTokenAndType(tokenValue, TokenType.PASSWORD_RESET)
                .orElseThrow(() -> new BadRequestException("Lien de réinitialisation invalide"));

        if (!token.isValid()) {
            throw new BadRequestException("Lien de réinitialisation expiré ou déjà utilisé");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    private void sendVerificationEmail(User user) {
        VerificationToken token = VerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .userId(user.getId())
                .type(TokenType.EMAIL_VERIFICATION)
                .expiresAt(Instant.now().plus(EMAIL_VERIFICATION_EXPIRY_HOURS, ChronoUnit.HOURS))
                .build();
        tokenRepository.save(token);
        emailService.sendVerificationEmail(user.getEmail(), token.getToken());
    }

    private AuthResponse toAuthResponse(String token, User user) {
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), user.isEmailVerified());
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
