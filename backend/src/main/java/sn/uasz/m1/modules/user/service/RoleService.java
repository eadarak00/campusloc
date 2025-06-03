package sn.uasz.m1.modules.user.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import sn.uasz.m1.modules.user.entity.Role;
import sn.uasz.m1.modules.user.repository.RoleRepository;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepo;

    public void creerRole(Role role) {
        role.setCreerA(LocalDateTime.now());
        roleRepo.save(role);
    }

    public Role trouverRoleParId(Long id) {
        return roleRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("Le rôle avec l'identifiant %d n'existe pas !", id)));
    }

    public Role trouverRoleParNom(String nom) {
        return roleRepo.findByNom(nom)
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("Le rôle avec le nom '%s' n'existe pas !", nom)));
    }

    public Role modifierRole(Long id, Role role) {
        Role existingRole = trouverRoleParId(id);
        existingRole.setNom(role.getNom());
        existingRole.setModifierA(LocalDateTime.now());
        return roleRepo.save(existingRole);
    }
}
