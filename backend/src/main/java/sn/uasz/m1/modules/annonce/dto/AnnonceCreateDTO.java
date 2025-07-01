package sn.uasz.m1.modules.annonce.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
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

    private TypeDeLogement typeDeLogement;

    @Positive(message = "Le prix doit être positif")
    private Double prix;

    @NotBlank(message = "L'adresse est obligatoire")
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
}
