package sn.uasz.m1.fixtures;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationInitializer {

    private final RoleFixtures roleFixtures;

    @PostConstruct
    public void init() {
        System.out.println("Initialisation des données de l'application...");
        roleFixtures.init();
        System.out.println("Initialisation terminée.");
    }
}
