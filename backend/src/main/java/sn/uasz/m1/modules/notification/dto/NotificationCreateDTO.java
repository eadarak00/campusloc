package sn.uasz.m1.modules.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import sn.uasz.m1.modules.notification.enums.NotificationType;

@Getter
@Setter
public class NotificationCreateDTO {

    @NotBlank(message = "Le titre est requis.")
    private String titre;

    @NotBlank(message = "Le message est requis.")
    private String message;

    @NotNull(message = "L'identifiant du destinataire est requis.")
    private Long destinataireId;

    private NotificationType type;

    private Long referenceId;
}