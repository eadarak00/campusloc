package sn.uasz.m1.modules.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.user.entity.CodeValidation;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import java.util.List;


@Repository
public interface CodeValidationRepository extends JpaRepository<CodeValidation, Long> {
    List<CodeValidation> findByUtilisateurAndValide(Utilisateur utilisateur, boolean valide);
    boolean existsByUtilisateurAndValide(Utilisateur utilisateur, boolean valide);
}
