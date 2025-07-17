package sn.uasz.m1.modules.annonce.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.uasz.m1.core.utils.SessionManagerUtils;
import sn.uasz.m1.modules.annonce.dto.FavoriResponseDTO;
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
     * Ajoute une annonce aux favoris du prospect.
     *
     * @param annonceId l'identifiant de l'annonce
     * @param prospect  l'utilisateur qui ajoute en favori
     * @return l'objet Favori créé ou réactivé
     */
    @Transactional
    public FavoriResponseDTO ajouterFavori(Long annonceId) {
        Utilisateur prospect = SessionManagerUtils.getCurrentAuthenticatedUser();

        Annonce annonce = annonceService.trouverParId(annonceId);

        if (annonce.getStatut() != StatutAnnonce.ACCEPTER || annonce.isSupprime()) {
            throw new IllegalStateException("L'annonce n'est pas valide pour un ajout en favori.");
        }

        Optional<Favori> existant = favoriRepo.findByProspectAndAnnonce(prospect, annonce);

        if (existant.isPresent()) {
            Favori favori = existant.get();
            favori.setActif(true);
            favori.setSupprime(false);
            favori.setSupprimeA(null);
            Favori  saved = favoriRepo.save(favori);
            return toFavoriDTO(saved);
        }

        Favori favori = Favori.builder()
                .prospect(prospect)
                .annonce(annonce)
                .actif(true)
                .build();
        
        favori.setSupprime(false);

        Favori saved = favoriRepo.save(favori);

        return toFavoriDTO(saved);
    }

    /**
     * Supprime (désactive) une annonce des favoris d’un utilisateur.
     *
     * @param annonceId l'identifiant de l'annonce
     * @param prospect  l'utilisateur concerné
     */
    @Transactional
    public void retirerFavori(Long annonceId) {
        Utilisateur prospect = SessionManagerUtils.getCurrentAuthenticatedUser();
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
     * Liste les annonces favorites actives d’un utilisateur.
     *
     * @param prospect l'utilisateur concerné
     * @return la liste des favoris sous forme de DTO
     */
    public List<FavoriResponseDTO> listerFavoris() {
        Utilisateur prospect = SessionManagerUtils.getCurrentAuthenticatedUser();
        return favoriRepo.findByProspectAndActifTrue(prospect)
                .stream()
                .map(this::toFavoriDTO)
                .toList();
    }

    /**
     * Convertit un objet Favori en DTO pour affichage.
     *
     * @param favori l'objet Favori à convertir
     * @return le DTO correspondant
     */
    public FavoriResponseDTO toFavoriDTO(Favori favori) {
        Annonce annonce = favori.getAnnonce();
        Utilisateur proprietaire = annonce.getProprietaire();

        return FavoriResponseDTO.builder()
                .favoriId(favori.getId())
                .annonceId(annonce.getId())
                .titre(annonce.getTitre())
                .description(annonce.getDescription())
                .prix(annonce.getPrix())
                .ville(annonce.getVille())
                .adresse(annonce.getAdresse())
                .typeDeLogement(annonce.getTypeDeLogement())
                .nomProprietaire(proprietaire.getPrenom() + " " + proprietaire.getNom())
                .actif(favori.isActif())
                .build();
    }
}
