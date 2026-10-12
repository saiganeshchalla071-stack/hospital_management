package com.hospital.dto.response;

import com.hospital.entity.Department;

public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private String location;

    public DepartmentResponse() {
    }

    public DepartmentResponse(Long id, String name, String description, String location) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
    }

    public static DepartmentResponse fromEntity(Department department) {
        if (department == null) return null;
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getLocation()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
