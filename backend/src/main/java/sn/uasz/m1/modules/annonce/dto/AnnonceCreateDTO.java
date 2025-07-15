package sn.uasz.m1.modules.annonce.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;


@Getter
@Setter
public class AnnonceCreateDTO {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 100, message = "Le titre ne doit pas dépasser 100 caractères")
    private String titre;

    @Size(max = 2000, message = "La description ne doit pas dépasser 2000 caractères")
    private String description;

    @Enumerated(EnumType.STRING)
    private TypeDeLogement typeDeLogement;

    @Positive(message = "Le prix doit être positif")
    private Double prix;

    @Positive(message = "La caution doit être positive ")
    private Double caution;

    @PositiveOrZero(message = "Les charges peuvent être positif positives ou nulles ")
    private Double Charges = 0.0;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    @Positive(message = "La surface doit être positive")
    private int surface;

    @PositiveOrZero(message = "Le nombre de piece doit être positive")
    private int pieces = 0;

    @Positive(message = "Le nombre de chambres doit être positif")
    private int nombreDeChambres = 0;

    @PositiveOrZero(message = "Le nombre de salles de bains doit être positif")
    private int salleDeBains;

    @PositiveOrZero(message = "La capacité doit être positive")
    private int capacite = 0;
    
    private boolean meuble;
    private boolean negociable;
}
