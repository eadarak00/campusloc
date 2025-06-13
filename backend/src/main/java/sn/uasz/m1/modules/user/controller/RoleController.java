package sn.uasz.m1.modules.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import sn.uasz.m1.core.exceptions.RoleNotFoundException;
import sn.uasz.m1.modules.user.entity.Role;
import sn.uasz.m1.modules.user.service.RoleService;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@AllArgsConstructor
@RequestMapping("/v1/roles")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<Role>> listerRoles() {
        return ResponseEntity.ok(roleService.listerRoles());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<Role>> listerRolesActifs() {
        return ResponseEntity.ok(roleService.listerRolesActifs());
    }

    @GetMapping("/inactifs")
    public ResponseEntity<List<Role>> listerRolesInactifs() {
        return ResponseEntity.ok(roleService.listerRolesInactifs());
    }

     @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        try {
            Role role = roleService.trouverRoleParId(id);
            return ResponseEntity.ok(role);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

   @GetMapping
    public ResponseEntity<Role> getRoleByNom(@RequestParam String nom) {
        try {
            Role role = roleService.trouverRoleParNom(nom);
            return ResponseEntity.ok(role);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PostMapping
    public ResponseEntity<Role> creerRole(@RequestBody Role role) {
        return ResponseEntity.ok(roleService.creerRole(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> modifier(@PathVariable Long id, @RequestBody Role updatedRole) {
        Role role = roleService.modifierRole(id, updatedRole);
        return ResponseEntity.ok(role);
    }


    @PutMapping("/{id}/restore")
    public ResponseEntity<String> restoreRole(@PathVariable Long id) {
        try {
            roleService.restorerRole(id);
            return ResponseEntity.ok("Rôle restauré avec succès.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rôle non trouvé avec l'id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la restauration du rôle.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerRole(@PathVariable Long id) {
        roleService.supprimerRole(id);
        return ResponseEntity.noContent().build();
    }
}
