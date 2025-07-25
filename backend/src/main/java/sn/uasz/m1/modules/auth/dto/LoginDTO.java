package sn.uasz.m1.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String motDePasse;
}
