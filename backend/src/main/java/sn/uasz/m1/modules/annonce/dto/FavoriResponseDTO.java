package sn.uasz.m1.modules.annonce.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;

@Getter
@Setter
@Builder
public class FavoriResponseDTO {
    private Long favoriId;
    private Long annonceId;
    private String titre;
    private String description;
    private Double prix;
    private String ville;
    private String adresse;
    private TypeDeLogement typeDeLogement;
    private String nomProprietaire;
    private boolean actif;
}