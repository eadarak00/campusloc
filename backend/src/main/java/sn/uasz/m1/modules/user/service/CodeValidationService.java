package sn.uasz.m1.modules.user.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import sn.uasz.m1.core.email.EmailService;
import sn.uasz.m1.core.email.EmailUtils;
import sn.uasz.m1.modules.user.entity.CodeValidation;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.repository.CodeValidationRepository;
import sn.uasz.m1.modules.user.repository.UtilisateurRepository;

@Service
@RequiredArgsConstructor
public class CodeValidationService {

    private final CodeValidationRepository codeRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final EmailService emailService;

    public void genererEtEnvoyerCode(Utilisateur utilisateur) throws MessagingException {
        String code = String.format("%06d", new Random().nextInt(999999));
        Instant now = Instant.now();
        Instant expiration = now.plus(15, ChronoUnit.MINUTES);

        // Invalider les anciens codes non utilisés
        if (codeRepo.existsByUtilisateurAndValide(utilisateur, false)) {
            List<CodeValidation> anciens = codeRepo.findByUtilisateurAndValide(utilisateur, false);
            for (CodeValidation c : anciens) {
                c.setValide(true);
            }
            codeRepo.saveAll(anciens);
        }

        // Générer et sauvegarder le nouveau code
        CodeValidation validation = CodeValidation.builder()
                .code(code)
                .utilisateur(utilisateur)
                .creeA(now)
                .expireA(expiration)
                .valide(false)
                .build();

        codeRepo.save(validation);

        // Envoyer par email
        emailService.envoyerHtml(
        utilisateur.getEmail(),
        EmailUtils.sujetValidationInscription(),
        EmailUtils.corpsValidationInscriptionHTML(utilisateur.getPrenom(), code)
        );
    }

    public boolean validerCode(String email, String code) {
        // chercher l'utilisateur
        Utilisateur utilisateur = utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));

        // chercher le code non utilisé
        List<CodeValidation> codes = codeRepo.findByUtilisateurAndValide(utilisateur, false);
        if (codes.isEmpty()) {
            return false;
        }

        //chercher le bon code encore valide
        Optional<CodeValidation> match = codes.stream()
                .filter(c -> c.getCode().equals(code))
                .filter(c -> !c.isExpired())
                .findFirst();

        if (match.isEmpty()) {
            return false; // Mauvais code ou expiré
        }

        CodeValidation codeValidation = match.get();

        //marquer le code comme utilisé
        codeValidation.setValide(true);
        codeRepo.save(codeValidation);

        //activer l'utilisateur
        utilisateur.setActif(true);
        utilisateurRepo.save(utilisateur);

        return true;
    }

    public void supprimerCodesExpirés() {
        List<CodeValidation> codes = codeRepo.findAll();
        List<CodeValidation> expirés = codes.stream()
                .filter(CodeValidation::isExpired)
                .filter(c -> !c.isValide())
                .toList();
        codeRepo.deleteAll(expirés);
    }
}
