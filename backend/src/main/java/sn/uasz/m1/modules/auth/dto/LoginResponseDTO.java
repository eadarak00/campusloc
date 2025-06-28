package sn.uasz.m1.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String nom;
    private String prenom;
    private String email;
    private String role;
}
