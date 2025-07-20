package sn.uasz.m1.modules.annonce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.annonce.dto.FavoriResponseDTO;
import sn.uasz.m1.modules.annonce.service.FavoriService;

@RestController
@RequestMapping("/v1/favoris")
@RequiredArgsConstructor
public class FavoriController {

    private final FavoriService favoriService;

    @PreAuthorize("hasRole('PROSPECT')")
    @PostMapping("/{annonceId}")
    public ResponseEntity<FavoriResponseDTO> ajouter(@PathVariable Long annonceId) {
        FavoriResponseDTO favori = favoriService.ajouterFavori(annonceId);
        return ResponseEntity.ok(favori);
    }

    @PreAuthorize("hasRole('PROSPECT')")
    @DeleteMapping("/{annonceId}")
    public ResponseEntity<Void> supprimer(@PathVariable Long annonceId) {
        favoriService.retirerFavori(annonceId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('PROSPECT')")
    @GetMapping
    public ResponseEntity<List<FavoriResponseDTO>> lister() {
        List<FavoriResponseDTO> favoris = favoriService.listerFavoris();
        return ResponseEntity.ok(favoris);
    }
}
