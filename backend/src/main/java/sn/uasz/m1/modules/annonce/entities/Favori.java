package sn.uasz.m1.modules.annonce.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
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
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Favori extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Le prospect qui a mis en favori
    @ManyToOne(optional = false)
    private Utilisateur prospect;

    // L'annonce mise en favori
    @ManyToOne(optional = false)
    private Annonce annonce;

    // Pour désactiver si l’annonce n’est plus disponible
    private boolean actif;

    @PrePersist
    public void onCreate() {
        this.actif = true;
        this.setCreerA(LocalDateTime.now());
    }
}
