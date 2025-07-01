package sn.uasz.m1.modules.annonce.dto;

import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;

@Getter
@Setter
public class AnnonceUpdateDTO {
    private String titre;
    private String description;
    private TypeDeLogement typeDeLogement;
    private Double prix;
    private String adresse;
    private String ville;
    private int surface;
    private int nombreDeChambres;
    private int capacite;
    private StatutAnnonce statut;
}
