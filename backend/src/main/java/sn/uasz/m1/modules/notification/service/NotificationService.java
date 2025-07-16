package sn.uasz.m1.modules.notification.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.notification.dto.NotificationCreateDTO;
import sn.uasz.m1.modules.notification.dto.NotificationResponseDTO;
import sn.uasz.m1.modules.notification.entity.Notification;
import sn.uasz.m1.modules.notification.repository.NotificationRepository;
import sn.uasz.m1.modules.user.entity.Utilisateur;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service de gestion des notifications dans l'application.
 * <p>
 * Fournit des méthodes pour créer, récupérer, mettre à jour et supprimer des notifications pour les utilisateurs.
 * </p>
 *
 * <ul>
 *   <li>{@link #creerNotification(NotificationCreateDTO, Utilisateur)} : Crée une nouvelle notification pour un utilisateur.</li>
 *   <li>{@link #getNotificationsUtilisateur(Long)} : Récupère toutes les notifications d'un utilisateur, triées par date d'envoi décroissante.</li>
 *   <li>{@link #getNotificationsNonLues(Long)} : Récupère toutes les notifications non lues d'un utilisateur.</li>
 *   <li>{@link #marquerCommeLue(Long)} : Marque une notification comme lue.</li>
 *   <li>{@link #supprimerNotification(Long)} : Supprime une notification par son identifiant.</li>
 *   <li>{@link #supprimerNotificationsUtilisateur(Long)} : Supprime toutes les notifications d'un utilisateur.</li>
 * </ul>
 *
 * <p>
 * Utilise en interne {@link NotificationRepository} pour les opérations de persistance et assure la conversion
 * entre les entités {@link Notification} et les objets de transfert de données {@link NotificationResponseDTO}.
 * </p>
 *
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Créer une nouvelle notification à partir du DTO
    public NotificationResponseDTO creerNotification(NotificationCreateDTO dto, Utilisateur destinataire) {
        Notification notification = new Notification();
        notification.setTitre(dto.getTitre());
        notification.setMessage(dto.getMessage());
        notification.setDestinataire(destinataire);
        notification.setLue(false);
        notification.setDateEnvoie(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);
        return mapToDTO(saved);
    }

    // Récupérer toutes les notifications d’un utilisateur
    public List<NotificationResponseDTO> getNotificationsUtilisateur(Long userId) {
        return notificationRepository
                .findByDestinataireIdOrderByDateEnvoieDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Notifications non lues
    public List<NotificationResponseDTO> getNotificationsNonLues(Long userId) {
        return notificationRepository
                .findByDestinataireIdAndLueFalseOrderByDateEnvoieDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Marquer comme lue
    public void marquerCommeLue(Long notifId) {
        Optional<Notification> notifOpt = notificationRepository.findById(notifId);
        notifOpt.ifPresent(notif -> {
            notif.setLue(true);
            notificationRepository.save(notif);
        });
    }

    // Supprimer une notification
    public void supprimerNotification(Long notifId) {
        notificationRepository.deleteById(notifId);
    }

    // Supprimer toutes les notifications d’un utilisateur
    public void supprimerNotificationsUtilisateur(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByDestinataireIdOrderByDateEnvoieDesc(userId);
        notificationRepository.deleteAll(notifications);
    }

    // Mapper Notification → NotificationResponseDTO
    private NotificationResponseDTO mapToDTO(Notification n) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(n.getId());
        dto.setTitre(n.getTitre());
        dto.setMessage(n.getMessage());
        dto.setLue(n.isLue());
        dto.setDateEnvoie(n.getDateEnvoie());
        if (n.getDestinataire() != null) {
            dto.setDestinataireId(n.getDestinataire().getId());
            dto.setDestinataireNom(n.getDestinataire().getNom());
        }
        return dto;
    }
}
