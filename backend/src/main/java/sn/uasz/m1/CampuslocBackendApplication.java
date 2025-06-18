package sn.uasz.m1;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.fixtures.RoleFixtures;
import sn.uasz.m1.fixtures.UtilisateurFixtures;

// @SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@SpringBootApplication
@EnableJpaAuditing
@RequiredArgsConstructor
@Slf4j
public class CampuslocBackendApplication implements CommandLineRunner {

    private final RoleFixtures roleFixtures;
    private final UtilisateurFixtures utilisateurFixtures;

    public static void main(String[] args) {
        SpringApplication.run(CampuslocBackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        log.info("Démarrage de l'application...");
        log.info("Début de l'initialisation des rôles...");
        roleFixtures.init();
        utilisateurFixtures.init();
        log.info("Fin de l'initialisation des rôles.");
    }
}

