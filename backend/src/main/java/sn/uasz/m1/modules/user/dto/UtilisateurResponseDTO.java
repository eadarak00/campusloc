package sn.uasz.m1.modules.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilisateurResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String photoProfil;
    private boolean actif;
    private boolean bloque;
    private String role;
}
