package sn.uasz.m1.fixtures;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.repository.UtilisateurRepository;
import sn.uasz.m1.modules.user.service.UtilisateurService;

@Component
@AllArgsConstructor
public class UtilisateurFixtures {

    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurService uService;


    public void init() {
        if (utilisateurRepository.existsByEmail("admin@campusloc.sn")) {
            return;
        }

        Utilisateur admin = new Utilisateur();
        admin.setNom("Super");
        admin.setPrenom("Admin");
        admin.setEmail("admin@campusloc.sn");
        admin.setMotDePasse("admin@123");
        admin.setTelephone("+221770000000");
        admin.setActif(true);

        uService.creerAdministrateur(admin);

        System.out.println("Administrateur initialisé : admin@campusloc.sn / Admin1234");
    }

}
