package com.hospital.service;

import com.hospital.dto.request.DepartmentRequest;
import com.hospital.dto.response.DepartmentResponse;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;

    public DepartmentService(DepartmentRepository departmentRepository, DoctorRepository doctorRepository) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return DepartmentResponse.fromEntity(department);
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName().trim())) {
            throw new ConflictException("Department with name '" + request.getName() + "' already exists");
        }

        Department department = new Department(
                request.getName().trim(),
                request.getDescription(),
                request.getLocation()
        );

        Department saved = departmentRepository.save(department);
        return DepartmentResponse.fromEntity(saved);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        if (!department.getName().equalsIgnoreCase(request.getName().trim())
                && departmentRepository.existsByName(request.getName().trim())) {
            throw new ConflictException("Department with name '" + request.getName() + "' already exists");
        }

        department.setName(request.getName().trim());
        department.setDescription(request.getDescription());
        department.setLocation(request.getLocation());

        Department updated = departmentRepository.save(department);
        return DepartmentResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        List<Doctor> doctors = doctorRepository.findByDepartmentId(id);
        if (!doctors.isEmpty()) {
            throw new BadRequestException("Cannot delete department because " + doctors.size() + " doctor(s) are assigned to it.");
        }

        departmentRepository.delete(department);
    }
}
