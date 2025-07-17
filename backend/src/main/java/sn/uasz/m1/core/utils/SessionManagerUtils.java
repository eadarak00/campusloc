package sn.uasz.m1.core.utils;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.service.UtilisateurService;

@RequiredArgsConstructor
public class SessionManagerUtils {

    private final UtilisateurService service;

    public static Utilisateur getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }
        return (Utilisateur) authentication.getPrincipal();
    }

    public static Long getCurrentAuthenticatedUserID() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }
        Utilisateur user = (Utilisateur) authentication.getPrincipal();
        return user.getId();
    }

    public  Long getAdminID(){
        Utilisateur user = service.trouverParEmail("admin@campusloc.sn");
        return user.getId();
    }
}
