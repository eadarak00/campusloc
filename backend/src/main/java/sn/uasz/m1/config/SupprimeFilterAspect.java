package sn.uasz.m1.config;


import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class SupprimeFilterAspect {

    private final EntityManager entityManager;

    @Around("@annotation(sn.uasz.m1.core.annotations.InclureElementsSupprimes)")
    public Object desactiverFiltreSupprime(ProceedingJoinPoint joinPoint) throws Throwable {
        Session session = entityManager.unwrap(Session.class);
        boolean filterWasEnabled = session.getEnabledFilter("supprimeFilter") != null;

        try {
            if (filterWasEnabled) {
                session.disableFilter("supprimeFilter");
            }
            return joinPoint.proceed();
        } finally {
            if (filterWasEnabled) {
                session.enableFilter("supprimeFilter").setParameter("isSupprime", false);
            }
        }
    }
}
