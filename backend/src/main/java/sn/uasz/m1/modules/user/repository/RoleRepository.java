package sn.uasz.m1.modules.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1.modules.user.entity.Role;

@Repository
public interface RoleRepository extends  JpaRepository<Role, Long> {
    Optional<Role> findByNom(String nom);
}
