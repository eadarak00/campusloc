package sn.uasz.m1.modules.annonce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.annonce.emuns.StatutAnnonce;
import sn.uasz.m1.modules.annonce.emuns.TypeDeLogement;
import sn.uasz.m1.modules.annonce.entities.Annonce;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
       List<Annonce> findByProprietaireId(Long id);

       List<Annonce> findBySupprimeTrue();

       List<Annonce> findBySupprimeFalse();
        List<Annonce> findBySupprimeFalseAndStatut(StatutAnnonce statut);

       List<Annonce> findByProprietaireIdAndSupprimeFalseAndStatut(Long proprietaireId, StatutAnnonce statut);

       List<Annonce> findByVilleIgnoreCaseAndSupprimeFalseAndStatut(String ville, StatutAnnonce statut);

       List<Annonce> findByVilleIgnoreCase(String ville);

       List<Annonce> findByTypeDeLogementAndPrixBetween(TypeDeLogement type, Double minPrix, Double maxPrix);

       List<Annonce> findByTypeDeLogementAndPrixBetweenAndSupprimeFalseAndStatut(
                     TypeDeLogement type,
                     Double min,
                     Double max,
                     StatutAnnonce statut);

       // @Query("SELECT a FROM Annonce a WHERE " +
       //               "(:type IS NULL OR a.typeDeLogement = :type) AND " +
       //               "(:ville IS NULL OR LOWER(a.ville) = LOWER(:ville)) AND " +
       //               "(:minPrix IS NULL OR a.prix >= :minPrix) AND " +
       //               "(:maxPrix IS NULL OR a.prix <= :maxPrix)")
       // List<Annonce> rechercherAnnonces(TypeDeLogement type, String ville, Double minPrix, Double maxPrix);

       @Query("SELECT a FROM Annonce a WHERE " +
                     "(:type IS NULL OR a.typeDeLogement = :type) AND " +
                     "(:ville IS NULL OR LOWER(a.ville) = LOWER(:ville)) AND " +
                     "(a.prix BETWEEN :minPrix AND :maxPrix) AND " +
                     "a.supprime = false AND a.statut = 'ACCEPTER'")
       List<Annonce> rechercherAnnonces(
                     @Param("type") TypeDeLogement type,
                     @Param("ville") String ville,
                     @Param("minPrix") Double minPrix,
                     @Param("maxPrix") Double maxPrix);

}