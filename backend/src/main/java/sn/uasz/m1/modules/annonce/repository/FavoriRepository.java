package sn.uasz.m1.modules.annonce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.entities.Favori;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Repository
public interface FavoriRepository extends JpaRepository<Favori, Long> {
    Optional<Favori> findByProspectAndAnnonce(Utilisateur prospect, Annonce annonce);
    List<Favori> findByProspectAndActifTrue(Utilisateur prospect);
}
