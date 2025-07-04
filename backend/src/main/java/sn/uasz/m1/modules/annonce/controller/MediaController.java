package sn.uasz.m1.modules.annonce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.modules.annonce.entities.Media;
import sn.uasz.m1.modules.annonce.service.MediaService;

@RestController
@RequestMapping("/api/v1/medias")
@RequiredArgsConstructor
@Slf4j
public class MediaController {

    private final MediaService mediaService;

    /**
     * Upload de fichiers médias pour une annonce
     */
    @PostMapping("/upload/{annonceId}")
    @PreAuthorize("hasRole('BAILLEUR')")
    public ResponseEntity<List<Media>> uploadMedias(
            @PathVariable Long annonceId,
            @RequestParam("files") List<MultipartFile> fichiers) {

        log.info("Upload de fichiers pour l'annonce {}", annonceId);
        List<Media> medias = mediaService.enregistrerFichiers(fichiers, annonceId);
        return ResponseEntity.ok(medias);
    }

    /**
     * Suppression d'un média par ID
     */
    @DeleteMapping("/{mediaId}")
    @PreAuthorize("hasRole('BAILLEUR')")
    public ResponseEntity<Void> supprimerMedia(@PathVariable Long mediaId) {
        log.info("Suppression du média avec ID {}", mediaId);
        mediaService.supprimerMedia(mediaId);
        return ResponseEntity.noContent().build();
    }
}
