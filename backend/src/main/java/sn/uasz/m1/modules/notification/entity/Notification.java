package sn.uasz.m1.modules.notification.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.uasz.m1.core.base.BaseEntity;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String message;
    private boolean lue;
    private LocalDateTime dateEnvoie;

        @PrePersist
        public void onCreate(){
            this.lue = false;
            this.dateEnvoie = LocalDateTime.now();
            this.setCreerA(LocalDateTime.now());
        }



}
