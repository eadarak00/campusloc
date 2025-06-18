package sn.uasz.m1.modules.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.auth.dto.RegisterDTO;
import sn.uasz.m1.modules.user.dto.UtilisateurResponseDTO;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.service.UtilisateurService;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    // private final AuthenticationManager authenticationManager;
    // private final JwtUtil jwtUtil;
    private final UtilisateurService utilisateurService;

    // Enregistrement (inscription)
    @PostMapping("/inscription")
    public ResponseEntity<UtilisateurResponseDTO> register(@Valid @RequestBody RegisterDTO dto) {
        Utilisateur utilisateur = utilisateurService.creerUtilisateur(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(utilisateurService.mapToResponseDTO(utilisateur));
    }

    @GetMapping("/public")
    public ResponseEntity<String> testPublic() {
        return ResponseEntity.ok("Endpoint public accessible sans authentification.");
    }
    // // Connexion (login)
    // @PostMapping("/login")
    // public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginDTO dto) {
    //     authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getMotDePasse())
    //     );

    //     Utilisateur user = utilisateurService.trouverParEmail(dto.getEmail());
    //     String jwt = jwtUtil.generateToken(user);

    //     return ResponseEntity.ok(Map.of("token", jwt));
    // }

    // Profil utilisateur connecté
    // @GetMapping("/me")
    // public ResponseEntity<UtilisateurResponseDTO> me(Authentication authentication) {
    //     String email = authentication.getName();
    //     Utilisateur utilisateur = utilisateurService.trouverParEmail(email);
    //     return ResponseEntity.ok(utilisateurService.mapToResponseDTO(utilisateur));
    // }
}
