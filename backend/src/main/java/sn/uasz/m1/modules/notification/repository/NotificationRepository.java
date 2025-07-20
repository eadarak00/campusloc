package sn.uasz.m1.modules.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.notification.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
     // Toutes les notifications d’un utilisateur (par ID), les plus récentes d’abord
    List<Notification> findByDestinataireIdOrderByDateEnvoieDesc(Long destinataireId);

    // Notifications non lues
    List<Notification> findByDestinataireIdAndLueFalseOrderByDateEnvoieDesc(Long destinataireId);
}
