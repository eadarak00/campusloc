package sn.uasz.m1.modules.annonce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.annonce.entities.Annonce;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
    
}