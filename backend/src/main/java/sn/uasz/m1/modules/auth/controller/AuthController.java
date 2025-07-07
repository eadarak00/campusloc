package sn.uasz.m1.modules.auth.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @PostMapping("/inscription")
    public ResponseEntity<UtilisateurResponseDTO> register(@Valid @RequestBody RegisterDTO dto) {
        final Logger logger = LoggerFactory.getLogger(AuthController.class);

        // 1. Log de début de traitement
        logger.info("Tentative d'inscription pour l'email: {}", dto.getEmail());
        logger.debug("Données reçues - Prénom: {}, Nom: {}, Téléphone: {}",
                dto.getPrenom(), dto.getNom(), dto.getTelephone());

        try {
            // 2. Création de l'utilisateur
            Utilisateur utilisateur = utilisateurService.creerUtilisateur(dto);

            // 3. Log de succès (sans données sensibles)
            logger.info("Inscription réussie - ID Utilisateur: {}, Email: {}",
                    utilisateur.getId(), utilisateur.getEmail());

            // 4. Transformation en DTO et réponse
            UtilisateurResponseDTO responseDTO = utilisateurService.mapToResponseDTO(utilisateur);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

        } catch (DataIntegrityViolationException e) {
            // 5. Log des erreurs de contraintes
            logger.error("Erreur d'intégrité des données - Email ou téléphone déjà existant", e);
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un compte existe déjà avec cet email ou ce numéro de téléphone");

        } catch (Exception e) {
            // 6. Log des erreurs inattendues
            logger.error("Erreur technique lors de l'inscription", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Une erreur technique est survenue");
        }
    }


    @PostMapping("/inscription-bailleur")
    public ResponseEntity<UtilisateurResponseDTO> creerBailleur(@Valid @RequestBody RegisterDTO dto) {
        final Logger logger = LoggerFactory.getLogger(AuthController.class);

        // 1. Log début
        logger.info("Tentative d'inscription d'un bailleur avec l'email: {}", dto.getEmail());
        logger.debug("Données reçues - Prénom: {}, Nom: {}, Téléphone: {}",
                dto.getPrenom(), dto.getNom(), dto.getTelephone());

        try {
            // 2. Création du bailleur
            Utilisateur utilisateur = utilisateurService.creerBailleur(dto);

            // 3. Log succès
            logger.info("Bailleur inscrit avec succès - ID: {}, Email: {}",
                    utilisateur.getId(), utilisateur.getEmail());

            // 4. Conversion DTO et réponse
            UtilisateurResponseDTO responseDTO = utilisateurService.mapToResponseDTO(utilisateur);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

        } catch (DataIntegrityViolationException e) {
            // 5. Conflit de données (email ou téléphone existant)
            logger.error("Erreur d'intégrité - Email ou téléphone existant", e);
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un bailleur existe déjà avec cet email ou ce numéro de téléphone");

        } catch (Exception e) {
            // 6. Erreur technique
            logger.error("Erreur technique lors de l'inscription du bailleur", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Une erreur technique est survenue lors de l'inscription du bailleur");
        }
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
                    utilisateur.getId(),
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

    @PostMapping("/renvoyer-code")
    public ResponseEntity<Map<String, Object>> renvoyerCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        // Vérifie que l'email est fourni
        if (email == null || email.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Email requis.");
            return ResponseEntity.badRequest().body(error);
        }

        // Recherche de l'utilisateur
        Utilisateur utilisateur = utilisateurService.trouverParEmail(email);

        // Génère et envoie un nouveau code
        validationService.genererEtEnvoyerCode(utilisateur);

        // Réponse JSON
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Nouveau code envoyé avec succès");
        response.put("email", email);
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
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
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getRole().getNom()));
    }

    @PostMapping("/verifier-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        boolean exists = utilisateurService.checkEmailExists(email);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);

        return ResponseEntity.ok(response);
    }
}
