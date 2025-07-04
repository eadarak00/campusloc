package sn.uasz.m1.modules.annonce.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.annonce.emuns.TypeMedia;
import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.entities.Media;
import sn.uasz.m1.modules.annonce.repository.MediaRepository;

@Service
@RequiredArgsConstructor
public class MediaService {

    // @Value("${media.upload.dir}")
    // private String uploadDir;
    @Value("${app.upload.dir}")
    private String uploadDir;
    private final MediaRepository mediaRepo;
    private final AnnonceService annonceService;

    private final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private final long MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    /**
     * Enregistre une liste de fichiers pour une annonce.
     * 
     * @param fichiers fichiers à enregistrer
     * @param annonce  annonce à associer
     * @return liste des médias enregistrés
     */

    public List<Media> enregistrerFichiers(List<MultipartFile> fichiers, Long annonceId) throws IOException {
        Annonce annonce = annonceService.trouverParId(annonceId);
        List<Media> medias = new ArrayList<>();

        for (MultipartFile fichier : fichiers) {
            validerTailleFichier(fichier);

            String nomFichier = UUID.randomUUID() + "_" + fichier.getOriginalFilename();

            // Construction du chemin absolu
            Path cheminFichier = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(nomFichier);

            // Création du dossier si besoin
            Files.createDirectories(cheminFichier.getParent());

            // Écriture physique
            fichier.transferTo(cheminFichier.toFile());

            // Construction de l'URL relative
            String url = "/uploads/annonces/" + nomFichier;

            Media media = Media.builder()
                    .nomFichier(nomFichier)
                    .url(url)
                    .typeMedia(detecterType(fichier.getContentType()))
                    .annonce(annonce)
                    .build();

            medias.add(mediaRepo.save(media));
        }

        return medias;
    }

    /**
     * Supprime un média d'une annonce (en base).
     * 
     * @param mediaId identifiant du média
     */
    public void supprimerMedia(Long mediaId) {
        Media media = mediaRepo.findById(mediaId)
                .orElseThrow(() -> new IllegalArgumentException("Média introuvable pour l'ID : " + mediaId));

        media.setSupprimeA(LocalDateTime.now());
        media.setSupprime(true);
        media.setAnnonce(null);

        mediaRepo.save(media);
    }

    /**
     * Détecte le type (IMAGE ou VIDEO) selon le content-type du fichier.
     */
    private TypeMedia detecterType(String contentType) {
        if (contentType != null && contentType.toLowerCase().startsWith("image"))
            return TypeMedia.IMAGE;
        else
            return TypeMedia.VIDEO;
    }

    public void validerTailleFichier(MultipartFile fichier) {
        String contentType = fichier.getContentType();
        long taille = fichier.getSize();

        if (contentType != null && contentType.startsWith("image")) {
            if (taille > MAX_IMAGE_SIZE) {
                throw new IllegalArgumentException("Taille d'image trop grande (max 10MB)");
            }
        } else if (contentType != null && contentType.startsWith("video")) {
            if (taille > MAX_VIDEO_SIZE) {
                throw new IllegalArgumentException("Taille de vidéo trop grande (max 50MB)");
            }
        } else {
            throw new IllegalArgumentException("Type de fichier non supporté");
        }
    }

}
