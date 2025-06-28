package sn.uasz.m1.modules.user.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import sn.uasz.m1.core.exceptions.RoleNotFoundException;
import sn.uasz.m1.modules.user.entity.Role;
import sn.uasz.m1.modules.user.repository.RoleRepository;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepo;

    public Role creerRole(Role role) {
        role.setCreerA(LocalDateTime.now());
        return roleRepo.save(role);
    }

    public Role trouverRoleParId(Long id) {
        return roleRepo.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));
    }

    public Role trouverRoleParNom(String nom) {
        return roleRepo.findByNom(nom)
                .orElseThrow(() -> new RoleNotFoundException(nom));
    }

    public boolean existeRoleParNom(String nom) {
        return roleRepo.findByNom(nom).isPresent();
    }

    public List<Role> listerRolesActifs() {
        return roleRepo.findAll().stream()
                .filter(role -> !role.isSupprime())
                .collect(Collectors.toList());
    }

    public Role modifierRole(Long id, Role role) {
        Role existingRole = trouverRoleParId(id);
        existingRole.setNom(role.getNom());
        existingRole.setModifierA(LocalDateTime.now());
        return roleRepo.save(existingRole);
    }

    public void supprimerRole(Long id) {
        Role role = trouverRoleParId(id);
        role.setSupprime(true);
        role.setSupprimeA(LocalDateTime.now());
        role.setModifierA(LocalDateTime.now());
        roleRepo.save(role);
    }

    public void restorerRole(Long id) {
        Role role = trouverRoleParId(id);
        role.setSupprime(false);
        role.setSupprimeA(null);
        role.setModifierA(LocalDateTime.now());
        roleRepo.save(role);
    }

    public List<Role> listerRoles() {
        return roleRepo.findAll();
    }

    public List<Role> listerRolesInactifs() {
        List<Role> tousLesRoles = listerRoles();
        List<Role> rolesActifs = listerRolesActifs();

        // Supprimer les rôles actifs de la liste complète
        tousLesRoles.removeAll(rolesActifs);

        return tousLesRoles; // Il ne reste que les rôles inactifs
    }

}
