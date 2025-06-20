package sn.uasz.m1.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class CodeValidationDTO {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String code;
}
