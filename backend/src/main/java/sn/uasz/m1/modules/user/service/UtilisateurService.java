package sn.uasz.m1.modules.user.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import sn.uasz.m1.modules.auth.dto.RegisterDTO;
import sn.uasz.m1.modules.user.dto.UtilisateurResponseDTO;
import sn.uasz.m1.modules.user.entity.Role;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.repository.UtilisateurRepository;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepo;
    private final RoleService roleService;
    private final PasswordEncoder encoder;

    // 📌 Créer un utilisateur à partir du DTO
    public Utilisateur creerUtilisateur(RegisterDTO dto) {
        if (utilisateurRepo.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé.");
        }

        Role role = roleService.trouverRoleParNom(dto.getRoleNom().toUpperCase());

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse(encoder.encode(dto.getMotDePasse()));
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setRole(role);
        utilisateur.setActif(false); // désactivé par défaut
        return utilisateurRepo.save(utilisateur);
    }

    public Utilisateur trouverParId(Long id) {
        return utilisateurRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé."));
    }

    public Utilisateur trouverParEmail(String email) {
        return utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé."));
    }

    public List<Utilisateur> listerTous() {
        return utilisateurRepo.findAll();
    }

    public List<Utilisateur> listerActifs() {
        return utilisateurRepo.findAll().stream()
                .filter(Utilisateur::isActif)
                .collect(Collectors.toList());
    }

    public List<Utilisateur> listerInactifs() {
        return utilisateurRepo.findAll().stream()
                .filter(u -> !u.isActif())
                .collect(Collectors.toList());
    }

    public Utilisateur activer(Long id) {
        Utilisateur u = trouverParId(id);
        u.setActif(true);
        return utilisateurRepo.save(u);
    }

    public Utilisateur bloquer(Long id) {
        Utilisateur u = trouverParId(id);
        u.setBloque(true);
        return utilisateurRepo.save(u);
    }

    public Utilisateur debloquer(Long id) {
        Utilisateur u = trouverParId(id);
        u.setBloque(false);
        return utilisateurRepo.save(u);
    }

    public Utilisateur mettreAJour(Long id, Utilisateur modifs) {
        Utilisateur existant = trouverParId(id);
        existant.setNom(modifs.getNom());
        existant.setPrenom(modifs.getPrenom());
        existant.setTelephone(modifs.getTelephone());
        existant.setModifierA(LocalDateTime.now());
        return utilisateurRepo.save(existant);
    }

    public void supprimerLogiquement(Long id) {
        Utilisateur u = trouverParId(id);
        u.setSupprime(true);
        u.setSupprimeA(LocalDateTime.now());
        utilisateurRepo.save(u);
    }

    public Utilisateur mettreAJourPhotoProfil(Long id, MultipartFile fichier) throws IOException {
        Utilisateur utilisateur = trouverParId(id);

        // Vérifier le type de fichier
        String contentType = fichier.getContentType();
        if (contentType == null || !contentType.matches("image/(jpeg|png)")) {
            throw new IllegalArgumentException("Format non supporté (JPEG ou PNG uniquement)");
        }

        // Préparation dossier
        String uploadDir = "uploads/profils/";
        Files.createDirectories(Paths.get(uploadDir));

        // Supprimer ancienne photo si elle n'est pas la photo par défaut
        if (utilisateur.getPhotoProfil() != null && !utilisateur.getPhotoProfil().contains("default")) {
            Path ancienne = Paths.get("uploads/" + utilisateur.getPhotoProfil().replace("/profils/", ""));
            Files.deleteIfExists(ancienne);
        }

        // Générer nom fichier
        String extension = contentType.equals("image/png") ? ".png" : ".jpg";
        String nomFichier = "user-" + id + extension;
        Path chemin = Paths.get(uploadDir + nomFichier);

        // Enregistrement sur disque
        Files.write(chemin, fichier.getBytes());

        // Mise à jour utilisateur
        utilisateur.setPhotoProfil("/profils/" + nomFichier);
        return utilisateurRepo.save(utilisateur);
    }

    public void restorerUtilisateur(Long id) {
        Utilisateur utilisateur = trouverParId(id);
        utilisateur.setSupprime(false);
        utilisateur.setSupprimeA(null);
        utilisateur.setModifierA(LocalDateTime.now());
        utilisateurRepo.save(utilisateur);
    }

    public UtilisateurResponseDTO mapToResponseDTO(Utilisateur user) {
        UtilisateurResponseDTO dto = new UtilisateurResponseDTO();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setPrenom(user.getPrenom());
        dto.setEmail(user.getEmail());
        dto.setTelephone(user.getTelephone());
        dto.setPhotoProfil(user.getPhotoProfil());
        dto.setActif(user.isActif());
        dto.setBloque(user.isBloque());
        dto.setRole(user.getRole().getNom());
        return dto;
    }

}
