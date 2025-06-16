package sn.uasz.m1.modules.user.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.user.dto.UtilisateurResponseDTO;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.service.UtilisateurService;

@RestController
@RequestMapping("v1/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    // Récupérer tous les utilisateurs (admin uniquement)
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UtilisateurResponseDTO>> getAll() {
        return ResponseEntity.ok(
            utilisateurService.listerTous().stream()
                .map(utilisateurService::mapToResponseDTO)
                .toList()
        );
    }

    // Récupérer les utilisateurs actifs
    @GetMapping("/actifs")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UtilisateurResponseDTO>> getActifs() {
        return ResponseEntity.ok(
            utilisateurService.listerActifs().stream()
                .map(utilisateurService::mapToResponseDTO)
                .toList()
        );
    }

     // Récupérer les utilisateurs actifs
    @GetMapping("/inactifs")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UtilisateurResponseDTO>> getInactifs() {
        return ResponseEntity.ok(
            utilisateurService.listerInactifs().stream()
                .map(utilisateurService::mapToResponseDTO)
                .toList()
        );
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurResponseDTO> getById(@PathVariable Long id) {
        Utilisateur user = utilisateurService.trouverParId(id);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(user));
    }

    // Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurResponseDTO> update(@PathVariable Long id, @RequestBody @Valid Utilisateur modif) {
        Utilisateur updated = utilisateurService.mettreAJour(id, modif);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(updated));
    }

    // Supprimer logiquement un utilisateur
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        utilisateurService.supprimerLogiquement(id);
        return ResponseEntity.noContent().build();
    }

    // Restaurer un utilisateur supprimé
    @PutMapping("/{id}/restaurer")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UtilisateurResponseDTO> restaurer(@PathVariable Long id) {
        utilisateurService.restorerUtilisateur(id);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(utilisateurService.trouverParId(id)));
    }

    // Activer un utilisateur
    @PutMapping("/{id}/activer")
    public ResponseEntity<UtilisateurResponseDTO> activer(@PathVariable Long id) {
        Utilisateur u = utilisateurService.activer(id);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(u));
    }

    // Bloquer un utilisateur
    @PutMapping("/{id}/bloquer")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UtilisateurResponseDTO> bloquer(@PathVariable Long id) {
        Utilisateur u = utilisateurService.bloquer(id);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(u));
    }

    // Debloquer un utilisateur
    @PutMapping("/{id}/debloquer")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UtilisateurResponseDTO> debloquer(@PathVariable Long id) {
        Utilisateur u = utilisateurService.debloquer(id);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(u));
    }

    // Modifier la photo de profil
    @PostMapping("/{id}/photo")
    public ResponseEntity<UtilisateurResponseDTO> uploadPhoto(@PathVariable Long id,
                                                              @RequestParam("file") MultipartFile fichier) throws IOException {
        Utilisateur u = utilisateurService.mettreAJourPhotoProfil(id, fichier);
        return ResponseEntity.ok(utilisateurService.mapToResponseDTO(u));
    }
}
