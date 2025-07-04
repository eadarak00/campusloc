package sn.uasz.m1.modules.annonce.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.uasz.m1.core.base.BaseEntity;
import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class Annonce extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 100, message = "Le titre ne doit pas dépasser 100 caractères")
    private String titre;

    @Column(columnDefinition = "TEXT")
    @Size(max = 2000, message = "La description ne doit pas dépasser 2000 caractères")
    private String description;

    @Enumerated(EnumType.STRING)
    private TypeDeLogement typeDeLogement;

    @Positive(message = "Le prix doit être positif")
    private Double prix;

    private LocalDateTime datePublication;

    @NotBlank(message = "La ville est obligatoire")
    private String adresse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    @Positive(message = "La surface doit être positive")
    private int surface;

    @Positive(message = "Le nombre de chambres doit être positif")
    private int nombreDeChambres;

    @Positive(message = "Le nombre de salles de bains doit être positif")
    private int salleDeBains;

    @Positive(message = "La capacité doit être positive")
    private int capacite;

    @ManyToOne
    private Utilisateur proprietaire;

    @Enumerated(EnumType.STRING)
    private StatutAnnonce statut;

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Media> medias;

    @PrePersist
    public void onCreate() {
        this.datePublication = LocalDateTime.now();
        this.statut = StatutAnnonce.EN_ATTENTE;
        this.setCreerA(LocalDateTime.now());
        this.setSupprime(false);
        this.medias = new ArrayList<>();
    }
}
