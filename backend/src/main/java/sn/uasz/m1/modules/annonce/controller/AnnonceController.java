package sn.uasz.m1.modules.annonce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.modules.annonce.dto.AnnonceCreateDTO;
import sn.uasz.m1.modules.annonce.dto.AnnonceResponseDTO;
import sn.uasz.m1.modules.annonce.dto.AnnonceUpdateDTO;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;
import sn.uasz.m1.modules.annonce.service.AnnonceService;

@RestController
@RequestMapping("/v1/annonces")
@RequiredArgsConstructor
@Slf4j
public class AnnonceController {

    private final AnnonceService annonceService;

    /**
     * Créer une nouvelle annonce (réservé aux bailleurs)
     */
    // @PostMapping
    // @PreAuthorize("hasRole('BAILLEUR')")
    // public ResponseEntity<AnnonceResponseDTO> creerAnnonce(
    // @Valid @RequestBody AnnonceCreateDTO dto) {
    // log.info("Reçu une demande de création d'annonce");

    // AnnonceResponseDTO reponse = annonceService.creerAnnonce(dto);
    // return ResponseEntity.status(HttpStatus.CREATED).body(reponse);
    // }
    @Operation(summary = "Créer une nouvelle annonce", description = "Endpoint réservé aux bailleurs pour publier une nouvelle annonce immobilière")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Annonce créée avec succès", content = @Content(schema = @Schema(implementation = AnnonceResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Accès refusé (rôle BAILLEUR requis)"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    @PostMapping
    @PreAuthorize("hasRole('BAILLEUR')")
    public ResponseEntity<AnnonceResponseDTO> creerAnnonce(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Payload de création d'annonce", required = true, content = @Content(schema = @Schema(implementation = AnnonceCreateDTO.class))) @Valid @RequestBody AnnonceCreateDTO dto) {

        log.info("Reçu une demande de création d'annonce");
        AnnonceResponseDTO reponse = annonceService.creerAnnonce(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(reponse);
    }

    /**
     * Valider une annonce (changer son statut en ACCEPTER)
     * Accessible uniquement par les ADMIN.
     */
    @PatchMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnonceResponseDTO> validerAnnonce(@PathVariable("id") Long annonceId) {
        log.info("Validation de l'annonce avec ID: {}", annonceId);

        AnnonceResponseDTO updatedAnnonce = annonceService.validerAnnonce(annonceId);

        return ResponseEntity.ok(updatedAnnonce);
    }

    /**
     * Valider plusieurs annonces en une seule requête.
     * Accessible uniquement par les ADMIN.
     */
    @PostMapping("/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnonceResponseDTO>> validerAnnonces(
            @RequestBody List<Long> annonceIds) {
        log.info("Validation batch de {} annonces", annonceIds.size());

        List<AnnonceResponseDTO> annoncesValidees = annonceService.validerAnnonces(annonceIds);

        return ResponseEntity.ok(annoncesValidees);
    }

    /**
     * Refuser une annonce (changer son statut en REFUSER)
     * Accessible uniquement par les ADMIN.
     */
    @PatchMapping("/{id}/refuser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnonceResponseDTO> refuserAnnonce(@PathVariable("id") Long annonceId) {
        log.info("Refus de l'annonce avec ID: {}", annonceId);

        AnnonceResponseDTO updatedAnnonce = annonceService.refuserAnnonce(annonceId);

        return ResponseEntity.ok(updatedAnnonce);
    }

    /**
     * Refuser plusieurs annonces en une seule requête.
     * Accessible uniquement par les ADMIN.
     */
    @PostMapping("/refuser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnonceResponseDTO>> refuserAnnonces(@RequestBody List<Long> annonceIds) {
        log.info("Refus batch de {} annonces", annonceIds.size());

        List<AnnonceResponseDTO> annoncesRefusees = annonceService.refuserAnnonces(annonceIds);

        return ResponseEntity.ok(annoncesRefusees);
    }

    /**
     * Lister toutes les annonces.
     * Accessible uniquement par les ADMIN.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnonceResponseDTO>> lister() {
        log.info("Listing de toutes les annonces");
        List<AnnonceResponseDTO> annonces = annonceService.lister();
        return ResponseEntity.ok(annonces);
    }

    /**
     * Lister les annonces inactives (supprimées).
     * Accessible uniquement par les ADMIN.
     */
    @GetMapping("/inactifs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnonceResponseDTO>> listerInactifs() {
        log.info("Listing des annonces inactives (supprimées)");
        List<AnnonceResponseDTO> annonces = annonceService.listerInactifs();
        return ResponseEntity.ok(annonces);
    }

    /**
     * Lister les annonces actives (non supprimées).
     * Accessible uniquement par les ADMIN.
     */
    @GetMapping("/actifs")
    public ResponseEntity<List<AnnonceResponseDTO>> listerActifs() {
        log.info("Listing des annonces actives");
        List<AnnonceResponseDTO> annonces = annonceService.listerActifs();
        return ResponseEntity.ok(annonces);
    }

    /**
     * Lister les annonces en attente de validation.
     * Accessible uniquement par les ADMIN.
     */
    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnonceResponseDTO>> listerEnAttente() {
        log.info("Listing des annonces en attente");
        List<AnnonceResponseDTO> annonces = annonceService.listerEnAttente();
        return ResponseEntity.ok(annonces);
    }

    /**
     * Lister les annonces actives (acceptées et non supprimées) d'un propriétaire.
     * Accessible uniquement par les utilisateurs avec le rôle BAILLEUR.
     */
    @GetMapping("/proprietaire/{id}/actifs")
    @PreAuthorize("hasRole('BAILLEUR')")
    public ResponseEntity<List<AnnonceResponseDTO>> listerParProprietaireActifs(
            @PathVariable("id") Long proprietaireId) {
        log.info("Listing des annonces actives pour le propriétaire ID: {}", proprietaireId);
        List<AnnonceResponseDTO> annonces = annonceService.listerParProprietaireActifs(proprietaireId);
        return ResponseEntity.ok(annonces);
    }

    /**
     * Lister les annonces en attente (non supprimées) d'un propriétaire.
     * Accessible uniquement par les utilisateurs avec le rôle BAILLEUR.
     */
    @GetMapping("/proprietaire/{id}/en-attente")
    @PreAuthorize("hasRole('BAILLEUR')")
    public ResponseEntity<List<AnnonceResponseDTO>> listerParProprietaireEnAttente(
            @PathVariable("id") Long proprietaireId) {
        log.info("Listing des annonces en attente pour le propriétaire ID: {}", proprietaireId);
        List<AnnonceResponseDTO> annonces = annonceService.listerParProprietaireEnAttente(proprietaireId);
        return ResponseEntity.ok(annonces);
    }

    /**
     * Rechercher les annonces par ville (actives et acceptées).
     * Accessible à tous ou à un rôle spécifique selon besoin.
     */
    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<AnnonceResponseDTO>> parVille(@PathVariable String ville) {
        log.info("Recherche des annonces par ville : {}", ville);
        List<AnnonceResponseDTO> annonces = annonceService.parVille(ville);
        return ResponseEntity.ok(annonces);
    }

    /**
     * Recherche avancée par type de logement et fourchette de prix.
     * Accessible à tous ou restreint selon sécurité souhaitée.
     */
    @GetMapping("/recherche")
    public ResponseEntity<List<AnnonceResponseDTO>> parCritere(
            @RequestParam TypeDeLogement type,
            @RequestParam Double minPrix,
            @RequestParam Double maxPrix) {
        log.info("Recherche des annonces par critère : type={}, minPrix={}, maxPrix={}", type, minPrix, maxPrix);
        List<AnnonceResponseDTO> annonces = annonceService.parCritere(type, minPrix, maxPrix);
        return ResponseEntity.ok(annonces);
    }

    /**
     * Recherche avancée avec critères optionnels : type, ville, fourchette de prix.
     * Accessible à tous ou sécurisé selon besoin.
     */
    @GetMapping("/recherche-avancee")
    public ResponseEntity<List<AnnonceResponseDTO>> rechercheAvancee(
            @RequestParam(required = false) TypeDeLogement type,
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) Double minPrix,
            @RequestParam(required = false) Double maxPrix) {

        log.info("Recherche avancée annonces : type={}, ville={}, minPrix={}, maxPrix={}", type, ville, minPrix,
                maxPrix);
        List<AnnonceResponseDTO> resultats = annonceService.rechercheAvancee(type, ville, minPrix, maxPrix);
        return ResponseEntity.ok(resultats);
    }

    /**
     * Mise à jour partielle d'une annonce.
     * Accessible uniquement par les BAILLEURS.
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('BAILLEUR')")
    public ResponseEntity<AnnonceResponseDTO> updateAnnonce(
            @PathVariable("id") Long annonceId,
            @RequestBody AnnonceUpdateDTO dto) {

        log.info("Mise à jour de l'annonce ID {} par un bailleur", annonceId);
        AnnonceResponseDTO updatedAnnonce = annonceService.update(annonceId, dto);
        return ResponseEntity.ok(updatedAnnonce);
    }
}