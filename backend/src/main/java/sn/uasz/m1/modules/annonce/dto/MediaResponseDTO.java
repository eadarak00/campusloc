package sn.uasz.m1.modules.annonce.dto;

import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.annonce.emuns.TypeMedia;

@Getter
@Setter
public class MediaResponseDTO {
    private Long id;
    private String nomFichier;
    private String url;
    private TypeMedia typeMedia;
}