package sn.uasz.m1.fixtures;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import sn.uasz.m1.modules.user.entity.Role;
import sn.uasz.m1.modules.user.service.RoleService;

@Component
@AllArgsConstructor
public class RoleFixtures {

    private final RoleService roleService;

    public void init() {
    List<String> roles = List.of("ADMIN", "BAILLEUR", "PROSPECT");

    roles.forEach(nom -> {
        if (!roleService.existeRoleParNom(nom)) {
            roleService.creerRole(new Role(nom));
        }
    });
}

}
