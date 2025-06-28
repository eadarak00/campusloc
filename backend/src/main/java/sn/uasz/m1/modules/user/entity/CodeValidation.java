package sn.uasz.m1.modules.user.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "code_validations", indexes = {
    @Index(name = "idx_code_utilisateur", columnList = "code, utilisateur_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeValidation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 6, nullable = false)
    private String code;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(name = "expire_a", nullable = false)
    private Instant expireA;

    @Column(name = "cree_a", nullable = false, updatable = false)
    private Instant creeA = Instant.now();

    @Column(nullable = false)
    private boolean valide = false;

    public boolean isExpired() {
        return Instant.now().isAfter(expireA);
    }

    public boolean isUsable() {
        return !valide && !isExpired();
    }
}
