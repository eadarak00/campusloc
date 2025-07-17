package sn.uasz.m1.modules.notification.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.notification.enums.NotificationType;

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

    private NotificationType type;
    private Long referenceId;
}