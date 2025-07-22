package sn.uasz.m1.modules.paiement.services;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.paiement.entities.Paiement;

@Service
@RequiredArgsConstructor
public class PayDunyaService {

    // Crée un RestTemplate réutilisable
    private final RestTemplate restTemplate = new RestTemplate();

    // URL SANDBOX (Test)
    private final String baseUrl = "https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create";

    // Clés SANDBOX pour tests
    private final String masterKey = "IEgQ7PV4-y6OK-GVSW-4LfV-xgJRQ2cwokAT";
    private final String publicKey = "test_public_zigJUsJgtgdXVZRpkrFkQJr6wjR";
    private final String privateKey = "test_private_WU3qDOcpcEvGxKISz9R4FBhYiyM";
    private final String token = "44zIHeEgV8wqUvWvJOu6";

    // public String initierPaiement(Paiement paiement) {
    //     // 1. Préparer les headers
    //     HttpHeaders headers = new HttpHeaders();
    //     headers.set("Content-Type", "application/json");
    //     headers.set("PAYDUNYA-MASTER-KEY", masterKey);
    //     headers.set("PAYDUNYA-PUBLIC-KEY", publicKey);
    //     headers.set("PAYDUNYA-PRIVATE-KEY", privateKey);
    //     headers.set("PAYDUNYA-TOKEN", token);

    //     // 2. Préparer la facture (invoice)
    //     Map<String, Object> invoice = Map.of(
    //             "items", List.of(
    //                     Map.of(
    //                             "name", "Déblocage de contact propriétaire",
    //                             "quantity", 1,
    //                             "unit_price", paiement.getMontant(),
    //                             "total_price", paiement.getMontant(),
    //                             "description",
    //                             "Accès complet aux coordonnées du propriétaire pour l'annonce concernée")),
    //             "total_amount", paiement.getMontant(),
    //             "description", "Paiement pour débloquer les informations de contact du propriétaire sur CampusLoc");

    //     // 3. Payload complet à envoyer
    //     Map<String, Object> payload = Map.of(
    //             "invoice", invoice,
    //             "store", Map.of("name", "CAMPUSLOC"),
    //             "actions", Map.of(
    //                     "cancel_url", "http://localhost:5173/prospect/paiement/annule",
    //                     "return_url", "http://localhost:5173/prospect/paiement/succes",
    //                     "callback_url", "https://campusloc-backend.com/api/v1/paiements/callback"),
    //             "custom_data", Map.of("reference", paiement.getReference()));

    //     // 4. Construction de la requête HTTP
    //     HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

    //     try {
    //         // 5. Envoi de la requête à PayDunya
    //         ResponseEntity<Map> response = restTemplate.postForEntity(baseUrl, request, Map.class);
    //         Map<String, Object> body = response.getBody();

    //         if (body == null) {
    //             throw new RuntimeException("Réponse vide de PayDunya");
    //         }

    //         Object responseCode = body.get("response_code");
    //         Object responseText = body.get("response_text");

    //         // Si tout s'est bien passé, la "response_code" doit valoir "00",
    //         // et le lien de paiement est dans "response_text"
    //         if ("00".equals(responseCode) && responseText != null) {
    //             return responseText.toString(); // C'est l'URL de la page de paiement
    //         } else {
    //             // Sinon, on renvoie le message d'erreur reçu pour aider au debug
    //             throw new RuntimeException("Échec PayDunya: " + body);
    //         }
    //     } catch (Exception e) {
    //         throw new RuntimeException("Erreur API PayDunya", e);
    //     }
    // }

    public Map<String, Object> initierPaiement(Paiement paiement, String contactId) {
    // 1. Préparer les headers
    HttpHeaders headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    headers.set("PAYDUNYA-MASTER-KEY", masterKey);
    headers.set("PAYDUNYA-PUBLIC-KEY", publicKey);
    headers.set("PAYDUNYA-PRIVATE-KEY", privateKey);
    headers.set("PAYDUNYA-TOKEN", token);

    // 2. Préparer la facture (invoice)
    Map<String, Object> invoice = Map.of(
            "items", List.of(
                    Map.of(
                            "name", "Déblocage de contact propriétaire",
                            "quantity", 1,
                            "unit_price", paiement.getMontant(),
                            "total_price", paiement.getMontant(),
                            "description",
                            "Accès complet aux coordonnées du propriétaire pour l'annonce concernée")),
            "total_amount", paiement.getMontant(),
            "description", "Paiement pour débloquer les informations de contact du propriétaire sur CampusLoc");

    // 3. Payload complet à envoyer (avec return_url dynamique)
    String returnUrl = "http://localhost:5173/prospect/paiement/succes?reference=" + paiement.getReference() + "&contactId=" + contactId;

    Map<String, Object> payload = Map.of(
            "invoice", invoice,
            "store", Map.of("name", "CAMPUSLOC"),
            "actions", Map.of(
                    "cancel_url", "http://localhost:5173/prospect/paiement/annule",
                    "return_url", returnUrl,
                    "callback_url", "https://campusloc-backend.com/api/v1/paiements/callback"),
            "custom_data", Map.of("reference", paiement.getReference()));

    // 4. Construction de la requête HTTP
    HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

    try {
        // 5. Envoi de la requête à PayDunya
        ResponseEntity<Map> response = restTemplate.postForEntity(baseUrl, request, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null) {
            throw new RuntimeException("Réponse vide de PayDunya");
        }

        Object responseCode = body.get("response_code");
        Object responseText = body.get("response_text");

        if ("00".equals(responseCode) && responseText != null) {
            return Map.of(
                "paiementUrl", responseText.toString(),
                "reference", paiement.getReference(),
                "contactId", contactId
            );
        } else {
            throw new RuntimeException("Échec PayDunya: " + body);
        }
    } catch (Exception e) {
        throw new RuntimeException("Erreur API PayDunya", e);
    }
}



    
}
