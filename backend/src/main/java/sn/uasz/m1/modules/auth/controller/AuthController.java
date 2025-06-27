package sn.uasz.m1.modules.auth.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.modules.auth.dto.LoginDTO;
import sn.uasz.m1.modules.auth.dto.LoginResponseDTO;
import sn.uasz.m1.modules.auth.dto.RefreshTokenDTO;
import sn.uasz.m1.modules.auth.dto.RegisterDTO;
import sn.uasz.m1.modules.auth.security.JwtUtil;
import sn.uasz.m1.modules.user.dto.CodeValidationDTO;
import sn.uasz.m1.modules.user.dto.UtilisateurResponseDTO;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.service.CodeValidationService;
import sn.uasz.m1.modules.user.service.UtilisateurService;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UtilisateurService utilisateurService;
    private final CodeValidationService validationService;

    // Enregistrement (inscription)
    @PostMapping("/inscription")
    public ResponseEntity<UtilisateurResponseDTO> register(@Valid @RequestBody RegisterDTO dto) {
        Utilisateur utilisateur = utilisateurService.creerUtilisateur(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(utilisateurService.mapToResponseDTO(utilisateur));
    }

    @PostMapping("/inscription-bailleur")
    public ResponseEntity<UtilisateurResponseDTO> registerBailleur(@Valid @RequestBody RegisterDTO dto) {
        Utilisateur utilisateur = utilisateurService.creerUtilisateur(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(utilisateurService.mapToResponseDTO(utilisateur));
    }

    @PostMapping("/valider")
    public ResponseEntity<?> valider(@Valid @RequestBody CodeValidationDTO dto) {
        boolean valide = validationService.validerCode(dto.getEmail(), dto.getCode());
        if (!valide) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Code invalide ou expiré"));
        }
        return ResponseEntity.ok(Map.of("message", "Compte activé avec succès"));
    }

    // @PostMapping("/connexion")
    // public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO dto) {
    // authenticationManager.authenticate(
    // new UsernamePasswordAuthenticationToken(dto.getEmail(),
    // dto.getMotDePasse()));

    // Utilisateur utilisateur = utilisateurService.trouverParEmail(dto.getEmail());

    // String accessToken = jwtUtil.genererAccessToken(utilisateur);
    // String refreshToken = jwtUtil.genererRefreshToken(utilisateur);

    // return ResponseEntity.ok(new LoginResponseDTO(
    // accessToken,
    // refreshToken,
    // utilisateur.getNom(),
    // utilisateur.getPrenom(),
    // utilisateur.getEmail(),
    // utilisateur.getRole().getNom()));
    // }

    @PostMapping("/connexion")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        try {
            log.debug("Tentative de connexion pour l'email: {}", dto.getEmail());

            // 1. Authentification
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getMotDePasse()));

            // 2. Récupération utilisateur
            Utilisateur utilisateur = utilisateurService.trouverParEmail(dto.getEmail());

            // 3. Génération des tokens
            String accessToken = jwtUtil.genererAccessToken(utilisateur);
            String refreshToken = jwtUtil.genererRefreshToken(utilisateur);

            log.info("Connexion réussie pour l'utilisateur: {} (ID: {})",
                    dto.getEmail(),
                    utilisateur.getId());

            return ResponseEntity.ok(new LoginResponseDTO(
                    accessToken,
                    refreshToken,
                    utilisateur.getNom(),
                    utilisateur.getPrenom(),
                    utilisateur.getEmail(),
                    utilisateur.getRole().getNom()));

        } catch (BadCredentialsException e) {
            log.warn("Tentative de connexion échouée (mauvais credentials) pour email: {}", dto.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Identifiants invalides");

        } catch (DisabledException | LockedException e) {
            log.warn("Tentative de connexion sur compte désactivé: {}", dto.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Compte désactivé");

        } catch (Exception e) {
            log.error("Erreur technique lors de la connexion", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur technique");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestBody RefreshTokenDTO dto) {
        String refreshToken = dto.getRefreshToken();
        String email = jwtUtil.extraireEmail(refreshToken);

        Utilisateur utilisateur = utilisateurService.trouverParEmail(email);

        if (!jwtUtil.estValide(refreshToken, utilisateur)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccess = jwtUtil.genererAccessToken(utilisateur);
        return ResponseEntity.ok(new LoginResponseDTO(
                newAccess,
                refreshToken,
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getRole().getNom()));
    }

    // Profil utilisateur connecté
    // @GetMapping("/me")
    // public ResponseEntity<UtilisateurResponseDTO> me(Authentication
    // authentication) {
    // String email = authentication.getName();
    // Utilisateur utilisateur = utilisateurService.trouverParEmail(email);
    // return ResponseEntity.ok(utilisateurService.mapToResponseDTO(utilisateur));
    // }
}
