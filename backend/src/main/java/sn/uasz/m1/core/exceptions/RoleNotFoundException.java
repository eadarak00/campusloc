package sn.uasz.m1.core.exceptions;

public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(Long id) {
        super(String.format("Le rôle avec l'identifiant %d n'existe pas !", id));
    }

    public RoleNotFoundException(String nom) {
        super(String.format("Le rôle avec le nom '%s' n'existe pas !", nom));
    }
}