package sn.uasz.m1.modules.annonce.emuns;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "TypeDeLogement",
    description = "Types de logements disponibles",
    enumAsRef = true
)
public enum TypeDeLogement {
    CHAMBRE_INDIVIDUELLE,
    CHAMBRE_PARTAGEE,
    APPARTEMENT,
    MAISON,
    STUDIO
}
