package sn.uasz.m1.modules.annonce.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    private final MediaRepository mediaRepo;
    private final AnnonceService annonceService;

    /**
     * Enregistre une liste de fichiers pour une annonce.
     * 
     * @param fichiers fichiers à enregistrer
     * @param annonce  annonce à associer
     * @return liste des médias enregistrés
     */
    public List<Media> enregistrerFichiers(List<MultipartFile> fichiers,  Long annonceId) {
        Annonce annonce = annonceService.trouverParId(annonceId);
        
        List<Media> medias = new ArrayList<>();
        
        for (MultipartFile fichier : fichiers) {
            String nomFichier = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
            String url = "/uploads/annonces/" + nomFichier;

            Media media = Media.builder()
                    .nomFichier(nomFichier)
                    .url(url)
                    .typeMedia(detecterType(fichier.getContentType()))
                    .annonce(annonce)
                    .build();

            medias.add(mediaRepo.save(media));

            // Optionnel : ici tu peux uploader physiquement le fichier sur disque ou cloud
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
}
