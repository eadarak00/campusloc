package sn.uasz.m1.modules.paiement.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.uasz.m1.core.utils.SessionManagerUtils;
import sn.uasz.m1.modules.annonce.emuns.StatutContact;
import sn.uasz.m1.modules.annonce.entities.Contact;
import sn.uasz.m1.modules.annonce.repository.ContactRepository;
import sn.uasz.m1.modules.paiement.entities.Paiement;
import sn.uasz.m1.modules.paiement.enums.StatutPaiement;
import sn.uasz.m1.modules.paiement.repositories.PaiementRepository;
import sn.uasz.m1.modules.user.entity.Utilisateur;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepo;
    private final ContactRepository contactRepo;
    private final PayDunyaService payDunyaService;

    /**
     * Initialise un paiement et retourne l’URL de redirection PayDunya
     */
    // public String initierPaiement(Long contactId, String operateur) {
    //     Utilisateur prospect = SessionManagerUtils.getCurrentAuthenticatedUser();
    //     Contact contact = contactRepo.findById(contactId)
    //             .orElseThrow(() -> new RuntimeException("Contact introuvable"));

    //     if (!List.of("WAVE", "ORANGE_MONEY").contains(operateur)) {
    //         throw new IllegalArgumentException("Opérateur non pris en charge");
    //     }

    //     Paiement paiement = Paiement.builder()
    //             .montant(2000.0)
    //             .operateur(operateur)
    //             .prospect(prospect)
    //             .contact(contact)
    //             .build();

    //     paiementRepo.save(paiement);

    //     return payDunyaService.initierPaiement(paiement);
    // }

    public Map<String, Object> initierPaiement(Long contactId, String operateur) {
    Utilisateur prospect = SessionManagerUtils.getCurrentAuthenticatedUser();
    Contact contact = contactRepo.findById(contactId)
            .orElseThrow(() -> new RuntimeException("Contact introuvable"));

    if (!List.of("WAVE", "ORANGE_MONEY").contains(operateur)) {
        throw new IllegalArgumentException("Opérateur non pris en charge");
    }

    Paiement paiement = Paiement.builder()
            .montant(2000.0)
            .operateur(operateur)
            .prospect(prospect)
            .contact(contact)
            .build();

    paiementRepo.save(paiement);

    // Appelle la méthode modifiée qui retourne Map avec URL, reference, contactId
    return payDunyaService.initierPaiement(paiement, contactId.toString());
}


    /**
     * Traite les callbacks de PayDunya (succès ou échec)
     */
    public void traiterCallback(Map<String, Object> callbackData) {
        String status = (String) callbackData.get("status");
        Map<String, Object> customData = (Map<String, Object>) callbackData.get("custom_data");
        String reference = (String) customData.get("reference");

        Paiement paiement = paiementRepo.findByReference(reference)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable (ref: " + reference + ")"));

        if ("completed".equalsIgnoreCase(status)) {
            paiement.setStatut(StatutPaiement.SUCCES);

            Contact contact = paiement.getContact();
            contact.setStatut(StatutContact.ACCEPTE);
            contactRepo.save(contact);
            // -> Ici tu peux notifer/exécuter d’autres actions si besoin après validation.
        } else {
            paiement.setStatut(StatutPaiement.ECHEC);
        }
        paiementRepo.save(paiement);
    }


    public boolean validerPaiement(String reference, String contactId) {
        Optional<Paiement> paiementOpt = paiementRepo.findByReference(reference);
        Optional<Contact> contactOpt = contactRepo.findById(Long.parseLong(contactId));

        if(paiementOpt.isEmpty() || contactOpt.isEmpty()) {
            return false;
        }

        Paiement paiement = paiementOpt.get();
        Contact contact = contactOpt.get();

        paiement.setStatut(StatutPaiement.SUCCES);
        paiementRepo.save(paiement);

        contact.setStatut(StatutContact.ACCEPTE);
        contactRepo.save(contact);

        return true;
    }
}
