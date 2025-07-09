package sn.uasz.m1.modules.annonce.dto;

import java.time.LocalDateTime;
import java.util.List;

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
    private Double caution;
    private Double charges;

    private String adresse;
    private String ville;

    private int surface;
    private int pieces;
    private int nombreDeChambres;
    private int salleDeBains;
    private int capacite;

    private LocalDateTime datePublication;
    private StatutAnnonce statut;

    private Long proprietaireId;
    private String nomProprietaire;
    private String emailProprietaire;
    private String telephoneProprietaire;

    private boolean disponible;
    private boolean meuble;
    private boolean negociable;

    private List<MediaResponseDTO> medias;
}
