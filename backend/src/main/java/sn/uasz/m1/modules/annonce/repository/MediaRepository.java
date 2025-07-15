package sn.uasz.m1.modules.annonce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.annonce.entities.Media;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByAnnonceId(Long annonceId);
}
