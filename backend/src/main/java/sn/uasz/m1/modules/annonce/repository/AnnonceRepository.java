package sn.uasz.m1.modules.annonce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;
import sn.uasz.m1.modules.annonce.entities.Annonce;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
     List<Annonce> findByProprietaireId(Long id);

    List<Annonce> findByVilleIgnoreCase(String ville);

    List<Annonce> findByTypeDeLogementAndPrixBetween(TypeDeLogement type, Double minPrix, Double maxPrix);

    @Query("SELECT a FROM Annonce a WHERE " +
           "(:type IS NULL OR a.typeDeLogement = :type) AND " +
           "(:ville IS NULL OR LOWER(a.ville) = LOWER(:ville)) AND " +
           "(:minPrix IS NULL OR a.prix >= :minPrix) AND " +
           "(:maxPrix IS NULL OR a.prix <= :maxPrix)")
    List<Annonce> rechercherAnnonces(TypeDeLogement type, String ville, Double minPrix, Double maxPrix);
}