package sn.uasz.m1.modules.annonce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1.core.utils.SessionManagerUtils;
import sn.uasz.m1.modules.annonce.dto.ContactResponseDTO;
import sn.uasz.m1.modules.annonce.dto.CoordonneesDTO;
import sn.uasz.m1.modules.annonce.emuns.StatutContact;
import sn.uasz.m1.modules.annonce.entities.Annonce;
import sn.uasz.m1.modules.annonce.entities.Contact;
import sn.uasz.m1.modules.annonce.repository.ContactRepository;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Service
@RequiredArgsConstructor
public class ContactService {
        private final AnnonceService annonceService;
        private final ContactRepository contactRepo;

        @Transactional
        public CoordonneesDTO debloquerCoordonnees(Long annonceId) {
                Utilisateur prospect = SessionManagerUtils.getCurrentAuthenticatedUser();
                Annonce annonce = annonceService.trouverParId(annonceId);

                boolean dejaContacte = contactRepo
                                .existsByAnnonceAndProspectAndAnnonce_SupprimeFalseAndSupprimeFalseAndStatutIn(
                                                annonce, prospect,
                                                List.of(StatutContact.EN_ATTENTE, StatutContact.ACCEPTE));
                if (!dejaContacte) {
                        Contact contact = Contact.builder()
                                        .annonce(annonce)
                                        .prospect(prospect)
                                        .build();
                        contactRepo.save(contact);
                }

                Utilisateur bailleur = annonce.getProprietaire();

                return CoordonneesDTO.builder()
                                .nom(bailleur.getNom())
                                .prenom(bailleur.getPrenom())
                                .email(bailleur.getEmail())
                                .telephone(bailleur.getTelephone())
                                .build();
        }

        public List<ContactResponseDTO> listerContactsParAnnonce(Long annonceId) {
                return contactRepo.findByAnnonce_IdAndSupprimeFalse(annonceId).stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        public List<ContactResponseDTO> listerContactsParProspect() {
                Long prospectId = SessionManagerUtils.getCurrentAuthenticatedUserID();
                return contactRepo.findByProspect_IdAndSupprimeFalse(prospectId).stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        public ContactResponseDTO toDto(Contact contact) {
                return ContactResponseDTO.builder()
                                .id(contact.getId())
                                .annonceId(contact.getAnnonce().getId())
                                .titreAnnonce(contact.getAnnonce().getTitre())
                                .prospectId(contact.getProspect().getId())
                                .nomProspect(contact.getProspect().getPrenom() + " " + contact.getProspect().getNom())
                                .dateContact(contact.getDateContact())
                                .statut(contact.getStatut())
                                .build();
        }

        public List<ContactResponseDTO> listerContactsDuBailleur() {
                Long bailleurId = SessionManagerUtils.getCurrentAuthenticatedUserID();

                List<Contact> contacts = contactRepo
                                .findByAnnonce_Proprietaire_IdAndAnnonce_SupprimeFalseAndSupprimeFalse(bailleurId);

                return contacts.stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

}
