package sn.uasz.m1.modules.paiement.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.paiement.services.PaiementService;

@RestController
@RequestMapping("/v1/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    // @PostMapping("/initier/{contactId}")
    // public ResponseEntity<Map<String, String>> initierPaiement(
    // @PathVariable Long contactId,
    // @RequestBody Map<String, String> request) {

    // String operateur = request.get("operateur");
    // String url = paiementService.initierPaiement(contactId, operateur);
    // return ResponseEntity.ok(Map.of("urlPaiement", url));
    // }

    @PostMapping("/initier/{contactId}")
    public ResponseEntity<Map<String, Object>> initierPaiement(
            @PathVariable Long contactId,
            @RequestBody Map<String, String> request) {

        String operateur = request.get("operateur");

        Map<String, Object> resultat = paiementService.initierPaiement(contactId, operateur);

        return ResponseEntity.ok(resultat);
    }

    @PostMapping("/valider")
    public ResponseEntity<?> validerPaiement(@RequestBody Map<String, String> data) {
        String reference = data.get("reference");
        String contactId = data.get("contactId");

        boolean success = paiementService.validerPaiement(reference, contactId);

        if (success) {
            return ResponseEntity.ok(Map.of("message", "Paiement et contact validés"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Impossible de valider"));
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<Void> callback(@RequestBody Map<String, Object> callbackData) {
        paiementService.traiterCallback(callbackData);
        return ResponseEntity.ok().build();
    }
}
