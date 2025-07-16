package sn.uasz.m1.modules.notification.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.uasz.m1.core.base.BaseEntity;
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
    private String message;
    private boolean lue;
    private LocalDateTime dateEnvoie;

    @ManyToOne
    private Utilisateur destinataire;

    @PrePersist
    public void onCreate() {
        this.lue = false;
        this.dateEnvoie = LocalDateTime.now();
        this.setCreerA(LocalDateTime.now());
    }

}
