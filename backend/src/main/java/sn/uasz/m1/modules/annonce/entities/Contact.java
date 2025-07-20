package sn.uasz.m1.modules.annonce.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.uasz.m1.core.base.BaseEntity;
import sn.uasz.m1.modules.annonce.emuns.StatutContact;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Contact extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Utilisateur prospect;

    @ManyToOne(optional = false)
    private Annonce annonce;

    private LocalDateTime dateContact;

    @Enumerated(EnumType.STRING)
    private StatutContact statut;

    @PrePersist
    public void init() {
        this.dateContact = LocalDateTime.now();
        this.statut = StatutContact.EN_ATTENTE;
        this.setCreerA(LocalDateTime.now());
        this.setSupprime(false);
    }
}
