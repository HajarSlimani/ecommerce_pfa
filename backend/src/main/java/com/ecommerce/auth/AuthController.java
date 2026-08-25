package com.ecommerce.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String GUEST_HEADER = "X-Guest-Cart-Id";

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                  @RequestHeader(value = GUEST_HEADER, required = false) String guestCartId) {
        return ResponseEntity.ok(authService.register(request, guestCartId));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                               @RequestHeader(value = GUEST_HEADER, required = false) String guestCartId) {
        return ResponseEntity.ok(authService.login(request, guestCartId));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request,
                                                         @RequestHeader(value = GUEST_HEADER, required = false) String guestCartId) {
        return ResponseEntity.ok(authService.loginWithGoogle(request, guestCartId));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request.getToken());
        return ResponseEntity.noContent().build();
    }

    /**
     * Toujours 204, que l'email existe en base ou non — voir
     * AuthService#forgotPassword pour l'explication (anti-énumération de comptes).
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}
