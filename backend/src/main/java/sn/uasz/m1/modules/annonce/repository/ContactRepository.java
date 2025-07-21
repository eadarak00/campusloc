package sn.uasz.m1.modules.annonce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.annonce.emuns.StatutContact;
import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.entities.Contact;
import sn.uasz.m1.modules.user.entity.Utilisateur;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    // Récupérer les contacts non supprimés d’un utilisateur donné
    List<Contact> findByProspect_IdAndSupprimeFalse(Long prospectId);

    // Récupérer les contacts non supprimés liés à une annonce
    List<Contact> findByAnnonce_IdAndSupprimeFalse(Long annonceId);

    // Récupérer les contacts non supprimés pour un prospect et une annonce
    List<Contact> findByProspect_IdAndAnnonce_IdAndSupprimeFalse(Long prospectId, Long annonceId);

    // Récupérer les contacts non supprimés avec un statut donné
    List<Contact> findByStatutAndSupprimeFalse(StatutContact statut);

    // Récupérer les contacts non supprimés d’un prospect avec un statut donné
    List<Contact> findByProspect_IdAndStatutAndSupprimeFalse(Long prospectId, StatutContact statut);

    // Compter les contacts non supprimés d’une annonce
    long countByAnnonce_IdAndSupprimeFalse(Long annonceId);

    // verifier si un contact avec l'annonce et le prospect e
    boolean existsByAnnonceAndProspectAndStatutAndAnnonce_SupprimeFalse(Annonce annonce, Utilisateur prospect,
            StatutContact statut);

    boolean existsByAnnonceAndProspectAndAnnonce_SupprimeFalseAndSupprimeFalseAndStatutIn(
            Annonce annonce,
            Utilisateur prospect,
            List<StatutContact> statuts);

    List<Contact> findByAnnonce_Proprietaire_IdAndAnnonce_SupprimeFalseAndSupprimeFalse(Long bailleurId);


}
