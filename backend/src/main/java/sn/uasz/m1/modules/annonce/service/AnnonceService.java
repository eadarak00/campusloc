package sn.uasz.m1.modules.annonce.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.hibernate.service.spi.ServiceException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.core.utils.SessionManagerUtils;
import sn.uasz.m1.modules.annonce.dto.AnnonceCreateDTO;
import sn.uasz.m1.modules.annonce.dto.AnnonceResponseDTO;
import sn.uasz.m1.modules.annonce.dto.AnnonceUpdateDTO;
import sn.uasz.m1.modules.annonce.dto.MediaResponseDTO;
import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;
import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.entities.Media;
import sn.uasz.m1.modules.annonce.repository.AnnonceRepository;
import sn.uasz.m1.modules.notification.dto.NotificationCreateDTO;
import sn.uasz.m1.modules.notification.enums.NotificationType;
import sn.uasz.m1.modules.notification.service.NotificationService;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.repository.UtilisateurRepository;
import sn.uasz.m1.modules.user.service.UtilisateurService;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnnonceService {
    private final AnnonceRepository annonceRepository;
    private final UtilisateurService uService;
    private final UtilisateurRepository uRepository;
    private final NotificationService notificationService;

    @PreAuthorize("hasRole('BAILLEUR')")
    @Transactional
    public AnnonceResponseDTO creerAnnonce(AnnonceCreateDTO dto) {
        try {
            log.info("Tentative de création d'annonce par {}", dto.toString());

            Utilisateur proprietaire = SessionManagerUtils.getCurrentAuthenticatedUser();

            if (!estBailleur(proprietaire)) {
                log.warn("Tentative de création par un non-bailleur: {}", proprietaire.getEmail());
                throw new AccessDeniedException("Seuls les bailleurs peuvent créer des annonces");
            }

            validateAnnonceDTO(dto);
            Annonce annonce = mapDtoToEntity(dto, proprietaire);

            Annonce saved = annonceRepository.save(annonce);
            log.info("Annonce créée avec ID: {}", saved.getId());

            // Création d'une notification
            NotificationCreateDTO notificationDTO = new NotificationCreateDTO();
            notificationDTO.setDestinataireId(uService.getAdminID());
            notificationDTO.setTitre("Annonce à valider : " + saved.getTitre());
            notificationDTO.setMessage(String.format(
                    "L'annonce \"%s\" a été créée par %s (%s). Type : %s | Ville : %s.",
                    saved.getTitre(),
                    proprietaire.getNom(),
                    proprietaire.getEmail(),
                    saved.getTypeDeLogement().toString().toLowerCase().replace("_", " "),
                    saved.getVille()));

            notificationDTO.setType(NotificationType.ANNONCE_CREEE);
            notificationDTO.setReferenceId(saved.getId());

            notificationService.creerNotification(notificationDTO);

            return toDto(saved);

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

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public AnnonceResponseDTO validerAnnonce(Long annonceId) {
        Annonce annonce = trouverParId(annonceId);

        // Mettre à jour le statut de l’annonce
        annonce.setStatut(StatutAnnonce.ACCEPTER);
        Annonce saved = annonceRepository.save(annonce);

        // Créer la notification pour le propriétaire
        NotificationCreateDTO notificationDTO = new NotificationCreateDTO();
        notificationDTO.setDestinataireId(saved.getProprietaire().getId());
        notificationDTO.setTitre("Annonce validée : " + saved.getTitre());
        notificationDTO.setMessage(String.format(
                "Votre annonce \"%s\" a été validée avec succès. Type : %s | Ville : %s.",
                saved.getTitre(),
                saved.getTypeDeLogement().toString().toLowerCase().replace("_", " "),
                saved.getVille()));
        notificationDTO.setType(NotificationType.ANNONCE_VALIDEE);
        notificationDTO.setReferenceId(saved.getId());

        // Enregistrer la notification
        notificationService.creerNotification(notificationDTO);

        // Retourner le DTO mis à jour
        return toDto(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public List<AnnonceResponseDTO> validerAnnonces(List<Long> annonceIds) {
        List<Annonce> annonces = annonceRepository.findAllById(annonceIds);

        if (annonces.isEmpty()) {
            throw new EntityNotFoundException("Aucune annonce trouvée pour les IDs fournis.");
        }

        // Mise à jour du statut pour chaque annonce
        annonces.forEach(annonce -> {
            if (!annonce.isSupprime() && annonce.getStatut() != StatutAnnonce.ACCEPTER) {
                annonce.setStatut(StatutAnnonce.ACCEPTER);
            }
        });

        // Sauvegarde en batch
        annonceRepository.saveAll(annonces);

        // Retourne la liste des DTO mis à jour
        return annonces.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public AnnonceResponseDTO refuserAnnonce(Long annonceId) {
        Annonce annonce = trouverParId(annonceId);

        // Mettre à jour le statut
        annonce.setStatut(StatutAnnonce.REFUSER);
        Annonce saved = annonceRepository.save(annonce);

        // Créer une notification pour le propriétaire
        NotificationCreateDTO notificationDTO = new NotificationCreateDTO();
        notificationDTO.setDestinataireId(saved.getProprietaire().getId());
        notificationDTO.setTitre("Annonce refusée : " + saved.getTitre());
        notificationDTO.setMessage(String.format(
                "Votre annonce \"%s\" a été refusée. Type : %s | Ville : %s.",
                saved.getTitre(),
                saved.getTypeDeLogement().toString().toLowerCase().replace("_", " "),
                saved.getVille()));
        notificationDTO.setType(NotificationType.ANNONCE_REJETEE);
        notificationDTO.setReferenceId(saved.getId());

        // Enregistrer la notification
        notificationService.creerNotification(notificationDTO);

        // Retourner le DTO mis à jour
        return toDto(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public List<AnnonceResponseDTO> refuserAnnonces(List<Long> annonceIds) {
        List<Annonce> annonces = annonceRepository.findAllById(annonceIds);

        if (annonces.isEmpty()) {
            throw new EntityNotFoundException("Aucune annonce trouvée pour les IDs fournis.");
        }

        // Mise à jour du statut pour chaque annonce
        annonces.forEach(annonce -> {
            if (!annonce.isSupprime() && annonce.getStatut() != StatutAnnonce.REFUSER) {
                annonce.setStatut(StatutAnnonce.ACCEPTER);
            }
        });

        // Sauvegarde en batch
        annonceRepository.saveAll(annonces);

        // Retourne la liste des DTO mis à jour
        return annonces.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public List<AnnonceResponseDTO> lister() {
        return annonceRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public List<AnnonceResponseDTO> listerInactifs() {
        return annonceRepository.findBySupprimeTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public List<AnnonceResponseDTO> listerActifs() {
        return annonceRepository.findBySupprimeFalse().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<AnnonceResponseDTO> listerValides() {
        return annonceRepository.findBySupprimeFalseAndStatut(StatutAnnonce.ACCEPTER).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public List<AnnonceResponseDTO> listerEnAttente() {
        return annonceRepository.findBySupprimeFalseAndStatut(StatutAnnonce.EN_ATTENTE).stream()
                .map(this::toDto)
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

    public AnnonceResponseDTO getById(Long id) {
        // Validation d'entrée
        Objects.requireNonNull(id, "L'id ne peut pas être null");

        Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Annonce introuvable pour l'id: " + id));

        verifierAccessibilite(annonce, id);

        return toDto(annonce);
    }

    @PreAuthorize("hasRole('BAILLEUR')")
    @Transactional
    public List<AnnonceResponseDTO> listerParProprietaireActifs(Long proprietaireId) {
        Objects.requireNonNull(proprietaireId, "L'ID propriétaire est obligatoire");

        if (!uRepository.existsByIdAndActifTrue(proprietaireId)) {
            throw new AccessDeniedException("Accès refusé ou propriétaire invalide");
        }

        return annonceRepository
                .findByProprietaireIdAndSupprimeFalseAndStatut(proprietaireId, StatutAnnonce.ACCEPTER)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('BAILLEUR')")
    @Transactional
    public List<AnnonceResponseDTO> listerParProprietaireEnAttente(Long proprietaireId) {
        Objects.requireNonNull(proprietaireId, "L'ID propriétaire est obligatoire");

        if (!uRepository.existsByIdAndActifTrue(proprietaireId)) {
            throw new AccessDeniedException("Accès refusé ou propriétaire invalide");
        }

        return annonceRepository
                .findByProprietaireIdAndSupprimeFalseAndStatut(proprietaireId, StatutAnnonce.EN_ATTENTE)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AnnonceResponseDTO> parVille(String ville) {
        return annonceRepository
                .findByVilleIgnoreCaseAndSupprimeFalseAndStatut(ville, StatutAnnonce.ACCEPTER)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AnnonceResponseDTO> parCritere(TypeDeLogement type, Double minPrix, Double maxPrix) {
        return annonceRepository.findByTypeDeLogementAndPrixBetween(type, minPrix, maxPrix).stream()
                .filter(a -> !a.isSupprime() && a.getStatut() == StatutAnnonce.ACCEPTER)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AnnonceResponseDTO> rechercheAvancee(TypeDeLogement type, String ville, Double minPrix,
            Double maxPrix) {
        return annonceRepository.rechercherAnnonces(type, ville, minPrix, maxPrix).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('BAILLEUR')")
    public AnnonceResponseDTO update(Long annonceId, AnnonceUpdateDTO dto) {
        // 1. Récupérer l'annonce existante
        Annonce annonce = annonceRepository.findById(annonceId)
                .orElseThrow(() -> new EntityNotFoundException("Annonce introuvable avec l'id : " + annonceId));

        // 2. Mettre à jour les champs si présents dans le DTO
        if (dto.getTitre() != null)
            annonce.setTitre(dto.getTitre());
        if (dto.getDescription() != null)
            annonce.setDescription(dto.getDescription());
        if (dto.getTypeDeLogement() != null)
            annonce.setTypeDeLogement(dto.getTypeDeLogement());
        if (dto.getPrix() != null)
            annonce.setPrix(dto.getPrix());
        if (dto.getCaution() != null)
            annonce.setCaution(dto.getCaution());
        if (dto.getCharges() != null)
            annonce.setCharges(dto.getCharges());
        if (dto.getAdresse() != null)
            annonce.setAdresse(dto.getAdresse());
        if (dto.getVille() != null)
            annonce.setVille(dto.getVille());
        if (dto.getSurface() >= 0)
            annonce.setSurface(dto.getSurface());
        if (dto.getSalleDeBains() >= 0)
            annonce.setSalleDeBains(dto.getSalleDeBains());
        if (dto.getPieces() >= 0)
            annonce.setPieces(dto.getPieces());
        if (dto.getNombreDeChambres() >= 0)
            annonce.setNombreDeChambres(dto.getNombreDeChambres());
        if (dto.getCapacite() >= 0)
            annonce.setCapacite(dto.getCapacite());
        if (dto.isMeuble() != annonce.isMeuble())
            annonce.setMeuble(dto.isMeuble());
        if (dto.isDisponible() != annonce.isDisponible())
            annonce.setDisponible(dto.isDisponible());
        if (dto.isNegociable() != annonce.isNegociable())
            annonce.setNegociable(dto.isNegociable());

        annonce.setModifierA(LocalDateTime.now());

        // 3. Sauvegarder l'annonce mise à jour
        Annonce annonceUpdatee = annonceRepository.save(annonce);

        // 4. Retourner le DTO de réponse
        return toDto(annonceUpdatee);
    }

    public void supprimerLogiqueAnnonce(Long annonceId) {
        Annonce annonce = trouverParId(annonceId);
        annonce.setSupprime(true);
        annonce.setSupprimeA(LocalDateTime.now());
        annonceRepository.save(annonce);
    }

    // == methodes utilitaire ==
    // private Utilisateur getCurrentAuthenticatedUser() {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // if (authentication == null || !authentication.isAuthenticated()) {
    // throw new AccessDeniedException("Utilisateur non authentifié");
    // }
    // return (Utilisateur) authentication.getPrincipal();
    // }

    private void validateAnnonceDTO(AnnonceCreateDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO ne peut pas être null");
        }
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

    public List<AnnonceResponseDTO> getSixDernieresAnnonces() {
        List<Annonce> annonces = annonceRepository
                .findTop6ByStatutAndSupprimeFalseOrderByCreerADesc(StatutAnnonce.ACCEPTER);
        return annonces.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AnnonceResponseDTO> getAnnonceParType(TypeDeLogement typeLogement) {
        return annonceRepository
                .findTop6ByStatutAndTypeDeLogementAndSupprimeFalseOrderByCreerADesc(StatutAnnonce.ACCEPTER,
                        typeLogement)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // == Definition des Mapping de maniere manuelle ==
    private Annonce mapDtoToEntity(AnnonceCreateDTO dto, Utilisateur proprietaire) {
        return Annonce.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .typeDeLogement(dto.getTypeDeLogement())
                .prix(dto.getPrix())
                .caution(dto.getCaution())
                .Charges(dto.getCharges())
                .adresse(dto.getAdresse())
                .ville(dto.getVille())
                .surface(dto.getSurface())
                .pieces(dto.getPieces())
                .nombreDeChambres(dto.getNombreDeChambres())
                .salleDeBains(dto.getSalleDeBains())
                .capacite(dto.getCapacite())
                .meuble(dto.isMeuble())
                .negociable(dto.isNegociable())
                .proprietaire(proprietaire)
                .build();
    }

    private AnnonceResponseDTO toDto(Annonce annonce) {
        return AnnonceResponseDTO.builder()
                .id(annonce.getId())
                .titre(annonce.getTitre())
                .description(annonce.getDescription())
                .typeDeLogement(annonce.getTypeDeLogement())
                .prix(annonce.getPrix())
                .caution(annonce.getCaution())
                .charges(annonce.getCharges())
                .adresse(annonce.getAdresse())
                .ville(annonce.getVille())
                .surface(annonce.getSurface())
                .pieces(annonce.getPieces())
                .nombreDeChambres(annonce.getNombreDeChambres())
                .salleDeBains(annonce.getSalleDeBains())
                .capacite(annonce.getCapacite())
                .disponible(annonce.isDisponible())
                .meuble(annonce.isMeuble())
                .negociable(annonce.isNegociable())
                .datePublication(annonce.getDatePublication())
                .dateModification(annonce.getModifierA())
                .statut(annonce.getStatut())
                .proprietaireId(annonce.getProprietaire().getId())
                .nomProprietaire(annonce.getProprietaire().getPrenom() + " " + annonce.getProprietaire().getNom())
                .emailProprietaire(annonce.getProprietaire().getEmail())
                .telephoneProprietaire(annonce.getProprietaire().getTelephone())
                .medias(annonce.getMedias() != null
                        ? annonce.getMedias().stream().map(this::toMediaDto).toList()
                        : new ArrayList<>())
                .build();
    }

    private MediaResponseDTO toMediaDto(Media media) {
        MediaResponseDTO dto = new MediaResponseDTO();
        dto.setId(media.getId());
        dto.setNomFichier(media.getNomFichier());
        dto.setUrl(media.getUrl());
        dto.setTypeMedia(media.getTypeMedia());
        return dto;
    }
}