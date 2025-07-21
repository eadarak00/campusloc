package sn.uasz.m1.modules.annonce.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.emuns.StatutContact;

@Getter
@Setter
@Builder
public class ContactResponseDTO {
    private Long id;
    private Long annonceId;
    private String titreAnnonce;
    private Long idProprietaire;
    private String nomProprietaire;
    private String emailProprietaire;
    private String telephoneProprietaire;
    private Long prospectId;
    private String nomProspect;
    private LocalDateTime dateContact;
    private StatutContact statut;
}