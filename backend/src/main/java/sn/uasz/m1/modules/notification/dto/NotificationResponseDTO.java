package sn.uasz.m1.modules.notification.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationResponseDTO {
    private Long id;
    private String titre;
    private String message;
    private boolean lue;
    private LocalDateTime dateEnvoie;
    private Long destinataireId;
    private String destinataireNom;
    private String destinataireEmail;
}
