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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import sn.uasz.m1.core.exceptions.RoleNotFoundException;
import sn.uasz.m1.modules.user.entity.Role;
import sn.uasz.m1.modules.user.service.RoleService;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@AllArgsConstructor
@RequestMapping("/v1/roles")
@Tag(name = "Gestion des Rôles", description = "Endpoints pour la gestion des rôles utilisateurs")
public class RoleController {

    private final RoleService roleService;

    @Operation(summary = "Lister tous les rôles", description = "Récupère la liste complète des rôles.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des rôles récupérée avec succès")
    })
    @GetMapping
    public ResponseEntity<List<Role>> listerRoles() {
        return ResponseEntity.ok(roleService.listerRoles());
    }

    @Operation(summary = "Lister les rôles actifs", description = "Récupère la liste des rôles actuellement actifs.")
    @ApiResponse(responseCode = "200", description = "Liste des rôles actifs récupérée avec succès")
    @GetMapping("/actifs")
    public ResponseEntity<List<Role>> listerRolesActifs() {
        return ResponseEntity.ok(roleService.listerRolesActifs());
    }

    @Operation(summary = "Lister les rôles inactifs", description = "Récupère la liste des rôles actuellement inactifs.")
    @ApiResponse(responseCode = "200", description = "Liste des rôles inactifs récupérée avec succès")
    @GetMapping("/inactifs")
    public ResponseEntity<List<Role>> listerRolesInactifs() {
        return ResponseEntity.ok(roleService.listerRolesInactifs());
    }

     @Operation(summary = "Obtenir un rôle par son ID", description = "Récupère les informations d'un rôle spécifique en utilisant son identifiant.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rôle trouvé"),
        @ApiResponse(responseCode = "404", description = "Rôle non trouvé")
    })
     @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        try {
            Role role = roleService.trouverRoleParId(id);
            return ResponseEntity.ok(role);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Obtenir un rôle par son nom", description = "Récupère les informations d'un rôle spécifique en utilisant son nom.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rôle trouvé"),
        @ApiResponse(responseCode = "404", description = "Rôle non trouvé")
    })
    @GetMapping("/par-nom")
    public ResponseEntity<Role> getRoleByNom(@RequestParam String nom) {
        try {
            Role role = roleService.trouverRoleParNom(nom);
            return ResponseEntity.ok(role);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

     @Operation(summary = "Créer un rôle", description = "Crée un nouveau rôle dans le système.")
    @ApiResponse(responseCode = "200", description = "Rôle créé avec succès")
    @PostMapping
    public ResponseEntity<Role> creerRole(@RequestBody Role role) {
        return ResponseEntity.ok(roleService.creerRole(role));
    }

     @Operation(summary = "Modifier un rôle", description = "Met à jour les informations d'un rôle existant.")
    @ApiResponse(responseCode = "200", description = "Rôle modifié avec succès")
    @PutMapping("/{id}")
    public ResponseEntity<Role> modifier(@PathVariable Long id, @RequestBody Role updatedRole) {
        Role role = roleService.modifierRole(id, updatedRole);
        return ResponseEntity.ok(role);
    }


     @Operation(summary = "Restaurer un rôle supprimé", description = "Restaure un rôle qui a été précédemment supprimé.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rôle restauré avec succès"),
        @ApiResponse(responseCode = "404", description = "Rôle non trouvé"),
        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
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

    @Operation(summary = "Supprimer un rôle", description = "Supprime un rôle du système.")
    @ApiResponse(responseCode = "204", description = "Rôle supprimé avec succès")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerRole(@PathVariable Long id) {
        roleService.supprimerRole(id);
        return ResponseEntity.noContent().build();
    }
}
