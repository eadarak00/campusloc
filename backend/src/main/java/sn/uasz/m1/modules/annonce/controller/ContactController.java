package sn.uasz.m1.modules.annonce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.annonce.dto.ContactResponseDTO;
import sn.uasz.m1.modules.annonce.dto.CoordonneesDTO;
import sn.uasz.m1.modules.annonce.service.ContactService;

@RestController
@RequestMapping("/v1/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * Permet à un prospect de débloquer les coordonnées d'un bailleur pour une
     * annonce.
     */
    @PreAuthorize("hasRole('PROSPECT')")
    @PostMapping("/annonces/{annonceId}/coordonnees")
    public ResponseEntity<CoordonneesDTO> debloquerCoordonnees(@PathVariable Long annonceId) {
        CoordonneesDTO coordonnees = contactService.debloquerCoordonnees(annonceId);
        return ResponseEntity.ok(coordonnees);
    }

    /**
     * Liste les contacts (demandes de contact) d'une annonce (réservé au bailleur).
     */
    @PreAuthorize("hasRole('BAILLEUR')")
    @GetMapping("/annonces/{annonceId}")
    public ResponseEntity<List<ContactResponseDTO>> listerContactsParAnnonce(@PathVariable Long annonceId) {
        List<ContactResponseDTO> contacts = contactService.listerContactsParAnnonce(annonceId);
        return ResponseEntity.ok(contacts);
    }

    /**
     * Liste les annonces contactées par un prospect (lui-même).
     */
    @PreAuthorize("hasRole('PROSPECT')")
    @GetMapping("/mes-contacts")
    public ResponseEntity<List<ContactResponseDTO>> listerContactsParProspect() {
        List<ContactResponseDTO> contacts = contactService.listerContactsParProspect();
        return ResponseEntity.ok(contacts);
    }

    @PreAuthorize("hasRole('BAILLEUR')")
    @GetMapping("/mes-annonces/contacts")
    public ResponseEntity<List<ContactResponseDTO>> listerContactsDuBailleur() {
        List<ContactResponseDTO> contacts = contactService.listerContactsDuBailleur();
        return ResponseEntity.ok(contacts);
    }

}