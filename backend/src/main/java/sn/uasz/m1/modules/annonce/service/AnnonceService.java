package sn.uasz.m1.modules.annonce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.hibernate.service.spi.ServiceException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.modules.annonce.dto.AnnonceCreateDTO;
import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.repository.AnnonceRepository;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnnonceService {
    private final AnnonceRepository annonceRepository;

    @PreAuthorize("hasRole('BAILLEUR')")
    @Transactional
    public Annonce creerAnnonce(AnnonceCreateDTO dto) {
        try {
            log.info("Tentative de création d'annonce par {}", dto.toString());

            Utilisateur proprietaire = getCurrentAuthenticatedUser();

            if (!estBailleur(proprietaire)) {
                log.warn("Tentative de création par un non-bailleur: {}", proprietaire.getEmail());
                throw new AccessDeniedException("Seuls les bailleurs peuvent créer des annonces");
            }

            validateAnnonceDTO(dto);
            Annonce annonce = mapDtoToEntity(dto, proprietaire);

            Annonce saved = annonceRepository.save(annonce);
            log.info("Annonce créée avec ID: {}", saved.getId());

            return saved;

        } catch (IllegalArgumentException e) {
            log.error("Erreur de validation: {}", e.getMessage());
            throw e;
        } catch (AccessDeniedException e) {
            log.error("Erreur d'autorisation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur technique lors de la création", e);
            throw new ServiceException("Erreur lors de la création de l'annonce");
        }
    }

    public List<Annonce> lister() {
        return annonceRepository.findAll();
    }

    public List<Annonce> listerInactifs() {
        return annonceRepository.findAll().stream()
                .filter(a -> a.isSupprime())
                .collect(Collectors.toList());
    }

    public List<Annonce> listerActifs() {
        return annonceRepository.findAll().stream()
                .filter(a -> !a.isSupprime())
                .collect(Collectors.toList());
    }

    public Annonce trouverParId(Long id) {
        // Validation d'entrée
        Objects.requireNonNull(id, "L'id ne peut pas être null");

        Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Annonce introuvable pour l'id: " + id));

        verifierAccessibilite(annonce, id);
        return annonce;
    }

    // public List<Annonce> listerParProprietaire(Long proprietaireId){
    //      // Validation
    //     Objects.requireNonNull(proprietaireId, "L'ID propriétaire est obligatoire");

    //         if (!proprietaireRepository.existsByIdAndActifTrue(proprietaireId)) {
    //     throw new AccessDeniedException("Accès refusé ou propriétaire invalide");
    // }

    // }

    private Utilisateur getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }
        return (Utilisateur) authentication.getPrincipal();
    }

    private void validateAnnonceDTO(AnnonceCreateDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO ne peut pas être null");
        }
    }

    private Annonce mapDtoToEntity(AnnonceCreateDTO dto, Utilisateur proprietaire) {
        return Annonce.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .typeDeLogement(dto.getTypeDeLogement())
                .prix(dto.getPrix())
                .adresse(dto.getAdresse())
                .ville(dto.getVille())
                .surface(dto.getSurface())
                .nombreDeChambres(dto.getNombreDeChambres())
                .salleDeBains(dto.getSalleDeBains())
                .capacite(dto.getCapacite())
                .proprietaire(proprietaire)
                .build();
    }

    public boolean estBailleur(Utilisateur utilisateur) {
        if (utilisateur == null || utilisateur.getRole() == null) {
            return false;
        }

        try {
            return utilisateur.getRole().getNom().equalsIgnoreCase("BAILLEUR");
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Structure de rôle invalide", e);

        }
    }

    private void verifierAccessibilite(Annonce annonce, Long id) {
        if (annonce.getStatut() == StatutAnnonce.REFUSER)
            throw new EntityNotFoundException("Annonce refusée pour l'id: " + id);
        if (annonce.isSupprime())
            throw new EntityNotFoundException("Annonce supprimée pour l'id: " + id);
        if (annonce.getProprietaire() == null)
            throw new IllegalStateException("Annonce corrompue: bailleur manquant pour l'id: " + id);
    }

}