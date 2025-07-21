package sn.uasz.m1.modules.annonce.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CoordonneesDTO {
    private String statut;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
}
