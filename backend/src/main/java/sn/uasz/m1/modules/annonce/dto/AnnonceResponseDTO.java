package sn.uasz.m1.modules.annonce.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;

@Getter
@Setter
@Builder
public class AnnonceResponseDTO {

    private Long id;

    private String titre;
    private String description;
    private TypeDeLogement typeDeLogement;
    private Double prix;

    private String adresse;
    private String ville;

    private int surface;
    private int nombreDeChambres;
    private int salleDeBains;
    private int capacite;

    private LocalDateTime datePublication;
    private StatutAnnonce statut;

    private Long proprietaireId;
    private String nomProprietaire;
    private String emailProprietaire;
}
