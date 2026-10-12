package com.hospital.repository;

import com.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);

    List<Doctor> findByDepartmentId(Long departmentId);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    @Query("SELECT d FROM Doctor d WHERE d.user.enabled = true")
    List<Doctor> findAllActiveDoctors();

    @Query("SELECT d FROM Doctor d WHERE d.user.enabled = true " +
           "AND (:deptId IS NULL OR d.department.id = :deptId) " +
           "AND (:query IS NULL OR LOWER(d.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "     OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchDoctors(@Param("deptId") Long deptId, @Param("query") String query);
}
