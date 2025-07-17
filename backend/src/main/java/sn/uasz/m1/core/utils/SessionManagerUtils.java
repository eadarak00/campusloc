package sn.uasz.m1.core.utils;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import sn.uasz.m1.modules.user.entity.Utilisateur;

public class SessionManagerUtils {

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
}
