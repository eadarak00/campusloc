package sn.uasz.m1.modules.annonce.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.entities.Favori;
import sn.uasz.m1.modules.annonce.repository.AnnonceRepository;
import sn.uasz.m1.modules.annonce.repository.FavoriRepository;
import sn.uasz.m1.modules.user.entity.Utilisateur;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriService {

    private final AnnonceService annonceService;

    private final FavoriRepository favoriRepo;
    private final AnnonceRepository annonceRepo;
    /**
     * Ajoute un favori pour un prospect
     */
    @Transactional
    public Favori ajouterFavori(Long annonceId, Utilisateur prospect) {
        Annonce annonce = annonceService.trouverParId(annonceId);

        if (annonce.getStatut() != StatutAnnonce.ACCEPTER && annonce.isSupprime()) {
            throw new IllegalStateException("L'annonce n'est pas valide pour un ajout en favori.");
        }

        Optional<Favori> existant = favoriRepo.findByProspectAndAnnonce(prospect, annonce);

        if (existant.isPresent()) {
            Favori favori = existant.get();
            favori.setActif(true);  
            return favoriRepo.save(favori);
        }

        Favori favori = Favori.builder()
                .prospect(prospect)
                .annonce(annonce)
                .build();

        return favoriRepo.save(favori);
    }

    /**
     * Supprime (désactive) un favori
     */
    @Transactional
    public void retirerFavori(Long annonceId, Utilisateur prospect) {
        Annonce annonce = annonceRepo.findById(annonceId)
                .orElseThrow(() -> new EntityNotFoundException("Annonce non trouvée"));

        Favori favori = favoriRepo.findByProspectAndAnnonce(prospect, annonce)
                .orElseThrow(() -> new EntityNotFoundException("Favori non trouvé pour cette annonce"));
            
        favori.setSupprime(true);
        favori.setSupprimeA(LocalDateTime.now());
        favori.setActif(false);
        favoriRepo.save(favori);
    }

    /**
     * Liste les favoris actifs d’un utilisateur
     */
    public List<Favori> listerFavoris(Utilisateur prospect) {
        return favoriRepo.findByProspectAndActifTrue(prospect);
    }
}
