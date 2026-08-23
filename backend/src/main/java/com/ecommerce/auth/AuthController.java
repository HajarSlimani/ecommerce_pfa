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
}
