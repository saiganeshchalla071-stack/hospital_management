package com.hospital.service;

import com.hospital.dto.request.DoctorRequest;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.entity.Role;
import com.hospital.entity.User;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository,
                         UserRepository userRepository,
                         DepartmentRepository departmentRepository,
                         PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getActiveDoctors() {
        return doctorRepository.findAllActiveDoctors().stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> searchDoctors(Long deptId, String query) {
        String searchQuery = StringUtils.hasText(query) ? query.trim() : null;
        return doctorRepository.searchDoctors(deptId, searchQuery).stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        return DoctorResponse.fromEntity(doctor);
    }

    public DoctorResponse getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user ID: " + userId));
        return DoctorResponse.fromEntity(doctor);
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already in use: " + email);
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        String rawPassword = StringUtils.hasText(request.getPassword()) ? request.getPassword() : "Doctor@123";

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setPhone(request.getPhone());
        user.setRole(Role.DOCTOR);
        user.setEnabled(request.getEnabled() != null ? request.getEnabled() : true);

        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setDepartment(department);
        doctor.setSpecialization(request.getSpecialization().trim());
        doctor.setQualification(request.getQualification().trim());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setBiography(request.getBiography());

        Doctor savedDoctor = doctorRepository.save(doctor);
        return DoctorResponse.fromEntity(savedDoctor);
    }

    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        User user = doctor.getUser();
        if (StringUtils.hasText(request.getEmail()) && !user.getEmail().equalsIgnoreCase(request.getEmail().trim())) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (userRepository.existsByEmail(newEmail)) {
                throw new ConflictException("Email is already in use: " + newEmail);
            }
            user.setEmail(newEmail);
        }

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (StringUtils.hasText(request.getPassword())) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
        userRepository.save(user);

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
            doctor.setDepartment(department);
        }

        if (StringUtils.hasText(request.getSpecialization())) {
            doctor.setSpecialization(request.getSpecialization().trim());
        }
        if (StringUtils.hasText(request.getQualification())) {
            doctor.setQualification(request.getQualification().trim());
        }
        if (request.getExperienceYears() != null) {
            doctor.setExperienceYears(request.getExperienceYears());
        }
        if (request.getConsultationFee() != null) {
            doctor.setConsultationFee(request.getConsultationFee());
        }
        if (request.getBiography() != null) {
            doctor.setBiography(request.getBiography());
        }

        Doctor updated = doctorRepository.save(doctor);
        return DoctorResponse.fromEntity(updated);
    }

    @Transactional
    public void toggleDoctorStatus(Long id, boolean enabled) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        User user = doctor.getUser();
        user.setEnabled(enabled);
        userRepository.save(user);
    }
}
