package sn.uasz.m1.modules.notification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.uasz.m1.modules.notification.dto.NotificationCreateDTO;
import sn.uasz.m1.modules.notification.dto.NotificationResponseDTO;
import sn.uasz.m1.modules.notification.service.NotificationService;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des notifications.
 * Fournit des endpoints pour créer, lister, marquer comme lue et supprimer des
 * notifications.
 *
 * <ul>
 * <li><b>POST /v1/notifications</b> : Créer une nouvelle notification.</li>
 * <li><b>GET /v1/notifications/utilisateur/{userId}</b> : Récupérer toutes les
 * notifications d’un utilisateur.</li>
 * <li><b>GET /v1/notifications/utilisateur/{userId}/non-lues</b> : Récupérer
 * les notifications non lues d’un utilisateur.</li>
 * <li><b>PUT /v1/notifications/{id}/lire</b> : Marquer une notification comme
 * lue.</li>
 * <li><b>DELETE /v1/notifications/{id}</b> : Supprimer une notification
 * spécifique.</li>
 * <li><b>DELETE /v1/notifications/utilisateur/{userId}</b> : Supprimer toutes
 * les notifications d’un utilisateur.</li>
 * </ul>
 *
 */
@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Créer une notification
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> creerNotification(@Valid @RequestBody NotificationCreateDTO dto) {
        NotificationResponseDTO responseDTO = notificationService.creerNotification(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsUtilisateurCurrent() {
        List<NotificationResponseDTO> list = notificationService.getNotificationsCurrentUtilisateur();
        return ResponseEntity.ok(list);
    }

    // Liste des notifications non lues
    @GetMapping("/non-lues")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsCurrentNonLues() {
        List<NotificationResponseDTO> list = notificationService.getNotificationsCurrentUtilisateurNonLues();
        return ResponseEntity.ok(list);
    }

    // Liste des notifications d’un utilisateur
    @GetMapping("/utilisateur/{userId}")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsUtilisateur(@PathVariable Long userId) {
        List<NotificationResponseDTO> list = notificationService.getNotificationsUtilisateur(userId);
        return ResponseEntity.ok(list);
    }

    // Liste des notifications non lues
    @GetMapping("/utilisateur/{userId}/non-lues")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsNonLues(@PathVariable Long userId) {
        List<NotificationResponseDTO> list = notificationService.getNotificationsNonLues(userId);
        return ResponseEntity.ok(list);
    }

    // Marquer comme lue
    @PutMapping("/{id}/lire")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable Long id) {
        notificationService.marquerCommeLue(id);
        return ResponseEntity.noContent().build();
    }

    // Supprimer une notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerNotification(@PathVariable Long id) {
        notificationService.supprimerNotification(id);
        return ResponseEntity.noContent().build();
    }

}
