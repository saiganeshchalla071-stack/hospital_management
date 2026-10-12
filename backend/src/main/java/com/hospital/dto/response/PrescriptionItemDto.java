package com.hospital.dto.response;

import com.hospital.entity.PrescriptionItem;

public class PrescriptionItemDto {
    private Long id;
    private String medicineName;
    private String dosage;
    private String frequency;
    private durationHolder dummy;
    private String duration;
    private String additionalInstructions;

    private static class durationHolder {}

    public PrescriptionItemDto() {
    }

    public PrescriptionItemDto(Long id, String medicineName, String dosage, String frequency, String duration, String additionalInstructions) {
        this.id = id;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.additionalInstructions = additionalInstructions;
    }

    public static PrescriptionItemDto fromEntity(PrescriptionItem item) {
        if (item == null) return null;
        return new PrescriptionItemDto(
                item.getId(),
                item.getMedicineName(),
                item.getDosage(),
                item.getFrequency(),
                item.getDuration(),
                item.getAdditionalInstructions()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getAdditionalInstructions() {
        return additionalInstructions;
    }

    public void setAdditionalInstructions(String additionalInstructions) {
        this.additionalInstructions = additionalInstructions;
    }
}
