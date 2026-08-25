package com.ecommerce.auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Envoi best-effort : une erreur d'envoi (SMTP mal configuré, etc.) est
 * loguée mais ne doit jamais faire échouer l'inscription ou la demande de
 * réinitialisation elle-même — voir AuthService, où ces appels sont
 * volontairement entourés d'un try/catch.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        send(toEmail, "Confirme ton adresse email — NewDev Shop", """
                <p>Bienvenue sur NewDev Shop !</p>
                <p>Confirme ton adresse email en cliquant sur ce lien :</p>
                <p><a href="%s">%s</a></p>
                <p>Ce lien expire dans 24h.</p>
                """.formatted(link, link));
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        send(toEmail, "Réinitialisation de mot de passe — NewDev Shop", """
                <p>Une demande de réinitialisation de mot de passe a été faite pour ce compte.</p>
                <p>Si c'est bien toi, clique ici pour choisir un nouveau mot de passe :</p>
                <p><a href="%s">%s</a></p>
                <p>Si tu n'es pas à l'origine de cette demande, ignore simplement cet email —
                ton mot de passe actuel reste inchangé.</p>
                <p>Ce lien expire dans 1h.</p>
                """.formatted(link, link));
    }

    private void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException | RuntimeException e) {
            log.error("Échec d'envoi d'email à {} : {}", to, e.getMessage());
        }
    }
}
