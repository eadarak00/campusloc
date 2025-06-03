package sn.uasz.m1.config;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope // Activation du filtre à chaque requête HTTP
public class HibernateFilterConfigurer {

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void enableFilter() {
        try {
            Session session = entityManager.unwrap(Session.class);
            if (session != null) {
                Filter filter = session.enableFilter("supprimeFilter");
                filter.setParameter("isSupprime", false);
            }
        } catch (Exception e) {
            System.err.println("Impossible d’activer le filtre 'supprimeFilter' : " + e.getMessage());
        }
    }
}
