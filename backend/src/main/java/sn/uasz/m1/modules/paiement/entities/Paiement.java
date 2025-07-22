package sn.uasz.m1.modules.paiement.entities;

import java.time.LocalDateTime;
import java.util.UUID;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.entities.Contact;
import sn.uasz.m1.modules.paiement.enums.StatutPaiement;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;

    private Double montant;

    private String operateur;

    @Enumerated(EnumType.STRING)
    private StatutPaiement statut;

    private LocalDateTime datePaiement;

    @ManyToOne
    @JoinColumn(name = "prospect_id")
    private Utilisateur prospect;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @PrePersist
    public void init() {
        this.reference = UUID.randomUUID().toString();
        this.datePaiement = LocalDateTime.now();
        this.statut = StatutPaiement.EN_ATTENTE;
    }
}
