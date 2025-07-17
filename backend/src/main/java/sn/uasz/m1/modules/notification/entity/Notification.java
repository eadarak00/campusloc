package sn.uasz.m1.modules.notification.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.uasz.m1.core.base.BaseEntity;
import sn.uasz.m1.modules.notification.enums.NotificationType;
import sn.uasz.m1.modules.user.entity.Utilisateur;

/**
 * Entité représentant une notification envoyée à un utilisateur.
 * <p>
 * Chaque notification contient un titre, un message, un statut de lecture, une date d'envoi,
 * et une référence vers l'utilisateur destinataire.
 * La notification est automatiquement marquée comme non lue et reçoit la date/heure courante lors de sa création.
 * </p>
 *
 */

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Notification extends BaseEntity {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(length = 1000)
    private String message;

    private boolean lue = false;

    private LocalDateTime dateEnvoie = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur destinataire;

    private Long referenceId;


    @PrePersist
    public void onCreate() {
        this.lue = false;
        this.dateEnvoie = LocalDateTime.now();
        this.setCreerA(LocalDateTime.now());
    }

}
