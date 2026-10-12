package com.hospital.config;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final BillRepository billRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           AppointmentRepository appointmentRepository,
                           MedicalRecordRepository medicalRecordRepository,
                           PrescriptionRepository prescriptionRepository,
                           BillRepository billRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.billRepository = billRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.findByEmail("admin@hospital.com").isPresent()) {
            logger.info("Hospital Management System sample data already initialized.");
            return;
        }

        logger.info("Initializing Hospital Management System sample data...");

        // 1. Create Administrator
        User adminUser = new User();
        adminUser.setFullName("System Administrator");
        adminUser.setEmail("admin@hospital.com");
        adminUser.setPasswordHash(passwordEncoder.encode("Admin@123"));
        adminUser.setPhone("+1-555-0100");
        adminUser.setRole(Role.ADMIN);
        adminUser.setEnabled(true);
        userRepository.save(adminUser);

        // 2. Create Departments
        Department cardiology = departmentRepository.save(new Department(
                "Cardiology",
                "Comprehensive care for coronary diseases, heart failure, and cardiovascular diagnostics.",
                "Wing A - 2nd Floor, Suite 201"
        ));
        Department neurology = departmentRepository.save(new Department(
                "Neurology",
                "Specialized care for neurological disorders, epilepsy, stroke, and central nervous system health.",
                "Wing B - 3rd Floor, Suite 305"
        ));
        Department pediatrics = departmentRepository.save(new Department(
                "Pediatrics",
                "Comprehensive healthcare, pediatric vaccines, and wellness exams for infants and adolescents.",
                "Wing C - 1st Floor, Suite 102"
        ));
        Department orthopedics = departmentRepository.save(new Department(
                "Orthopedics",
                "Advanced treatment for bone fractures, arthritis, joint replacements, and sports injuries.",
                "Wing A - 1st Floor, Suite 115"
        ));
        Department generalMed = departmentRepository.save(new Department(
                "General Medicine",
                "Primary care, preventive screenings, acute illness diagnosis, and outpatient consultations.",
                "Main Block - Ground Floor, Suite 10"
        ));

        // 3. Create Doctors
        Doctor drSarah = createDoctor("Dr. Sarah Jenkins", "dr.sarah@hospital.com", "+1-555-0111", cardiology,
                "Interventional Cardiology", "MBBS, MD (Cardiology), FACC", 12, new BigDecimal("150.00"),
                "Dr. Sarah Jenkins has over a decade of clinical experience in interventional cardiology and heart care.");

        Doctor drMichael = createDoctor("Dr. Michael Chang", "dr.michael@hospital.com", "+1-555-0112", neurology,
                "Clinical Neurology", "MD, DM (Neurology), FAAN", 9, new BigDecimal("180.00"),
                "Dr. Michael Chang specializes in stroke management, migraine disorders, and diagnostic EEG.");

        Doctor drEmily = createDoctor("Dr. Emily Rodriguez", "dr.emily@hospital.com", "+1-555-0113", pediatrics,
                "Pediatric Medicine", "MBBS, DCH, MD (Pediatrics)", 7, new BigDecimal("120.00"),
                "Dr. Emily Rodriguez is dedicated to child healthcare, developmental milestones, and pediatric care.");

        Doctor drDavid = createDoctor("Dr. David Kim", "dr.david@hospital.com", "+1-555-0114", orthopedics,
                "Orthopedic Surgery", "MS (Orthopedics), MCh (Joints)", 15, new BigDecimal("200.00"),
                "Dr. David Kim is a leading orthopedic surgeon with extensive expertise in joint replacements.");

        // 4. Create Patients
        Patient patientJohn = createPatient("John Doe", "john.doe@gmail.com", "+1-555-0121",
                LocalDate.of(1985, 4, 12), "124 Maple Street, Metropolis, NY 10001", "+1-555-0991");

        Patient patientJane = createPatient("Jane Smith", "jane.smith@gmail.com", "+1-555-0122",
                LocalDate.of(1992, 8, 25), "782 Oak Avenue, Metropolis, NY 10002", "+1-555-0992");

        Patient patientRobert = createPatient("Robert Johnson", "robert.j@gmail.com", "+1-555-0123",
                LocalDate.of(1978, 11, 3), "340 Pine Road, Metropolis, NY 10003", "+1-555-0993");

        Patient patientMaria = createPatient("Maria Garcia", "maria.g@gmail.com", "+1-555-0124",
                LocalDate.of(1995, 2, 17), "512 Elm Boulevard, Metropolis, NY 10004", "+1-555-0994");

        Patient patientDavid = createPatient("David Wilson", "david.w@gmail.com", "+1-555-0125",
                LocalDate.of(1989, 6, 30), "901 Cedar Lane, Metropolis, NY 10005", "+1-555-0995");

        // 5. Create Appointments
        Appointment appt1 = new Appointment(patientJohn, drSarah, LocalDate.now().minusDays(5),
                LocalTime.of(9, 0), LocalTime.of(9, 30),
                "Routine cardiac checkup and occasional palpitations after exercise.", AppointmentStatus.COMPLETED);
        appt1 = appointmentRepository.save(appt1);

        Appointment appt2 = new Appointment(patientJane, drMichael, LocalDate.now().plusDays(2),
                LocalTime.of(10, 0), LocalTime.of(10, 30),
                "Recurrent tension headaches and morning dizziness.", AppointmentStatus.APPROVED);
        appt2 = appointmentRepository.save(appt2);

        Appointment appt3 = new Appointment(patientRobert, drEmily, LocalDate.now().plusDays(4),
                LocalTime.of(11, 0), LocalTime.of(11, 30),
                "Seasonal allergies, persistent cough, and child immunization consult.", AppointmentStatus.PENDING);
        appt3 = appointmentRepository.save(appt3);

        Appointment appt4 = new Appointment(patientMaria, drDavid, LocalDate.now().minusDays(3),
                LocalTime.of(14, 0), LocalTime.of(14, 30),
                "Right knee pain and swelling after tennis game.", AppointmentStatus.COMPLETED);
        appt4 = appointmentRepository.save(appt4);

        Appointment appt5 = new Appointment(patientDavid, drSarah, LocalDate.now().plusDays(5),
                LocalTime.of(15, 0), LocalTime.of(15, 30),
                "Hypertension follow-up consultation and medication review.", AppointmentStatus.APPROVED);
        appt5 = appointmentRepository.save(appt5);

        // 6. Medical Records for Completed Appointments
        MedicalRecord rec1 = new MedicalRecord(patientJohn, drSarah, appt1,
                "Benign Sinus Tachycardia & Stage 1 Essential Hypertension",
                "BP: 138/88 mmHg, HR: 82 bpm. Resting ECG regular sinus rhythm. Advised sodium reduction and aerobic exercise.");
        rec1 = medicalRecordRepository.save(rec1);

        MedicalRecord rec2 = new MedicalRecord(patientMaria, drDavid, appt4,
                "Grade I Medial Meniscal Strain (Right Knee)",
                "Medial joint tenderness without laxity. Lachman test negative. Advised R.I.C.E. therapy and rehabilitation.");
        rec2 = medicalRecordRepository.save(rec2);

        // 7. Prescriptions
        Prescription presc1 = new Prescription(patientJohn, drSarah, rec1, LocalDate.now().minusDays(5),
                "Take medications with food. Monitor blood pressure twice weekly.");
        presc1.addItem(new PrescriptionItem("Amlodipine Besylate", "5mg", "Once daily (1-0-0)", "30 days", "Do not skip doses."));
        presc1.addItem(new PrescriptionItem("Metoprolol Tartrate", "25mg", "Twice daily (1-0-1)", "30 days", "Check pulse before taking."));
        prescriptionRepository.save(presc1);

        Prescription presc2 = new Prescription(patientMaria, drDavid, rec2, LocalDate.now().minusDays(3),
                "Apply cold pack for 15 minutes twice daily. Wear supportive knee sleeve.");
        presc2.addItem(new PrescriptionItem("Ibuprofen", "400mg", "Twice daily after food", "5 days", "Take strictly with food."));
        presc2.addItem(new PrescriptionItem("Glucosamine Sulfate", "500mg", "Once daily", "60 days", "Joint cartilage support."));
        prescriptionRepository.save(presc2);

        // 8. Bills
        billRepository.save(new Bill(patientJohn, appt1, new BigDecimal("150.00"), LocalDate.now().minusDays(5),
                PaymentStatus.PAID, "CARD", "Consultation fee for Dr. Sarah Jenkins (Cardiology) - Paid via Visa."));

        billRepository.save(new Bill(patientJane, appt2, new BigDecimal("180.00"), LocalDate.now().plusDays(2),
                PaymentStatus.PENDING, "CASH", "Scheduled consultation fee for Dr. Michael Chang (Neurology)."));

        billRepository.save(new Bill(patientMaria, appt4, new BigDecimal("200.00"), LocalDate.now().minusDays(3),
                PaymentStatus.PAID, "UPI", "Consultation & joint evaluation with Dr. David Kim (Orthopedics) - Paid via UPI."));

        billRepository.save(new Bill(patientDavid, appt5, new BigDecimal("150.00"), LocalDate.now().plusDays(5),
                PaymentStatus.PENDING, "CARD", "Scheduled consultation fee for Dr. Sarah Jenkins (Cardiology)."));

        logger.info("Hospital Management System sample data successfully initialized!");
    }

    private Doctor createDoctor(String fullName, String email, String phone, Department dept,
                                 String spec, String qual, int exp, BigDecimal fee, String bio) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("Doctor@123"));
        user.setPhone(phone);
        user.setRole(Role.DOCTOR);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setDepartment(dept);
        doctor.setSpecialization(spec);
        doctor.setQualification(qual);
        doctor.setExperienceYears(exp);
        doctor.setConsultationFee(fee);
        doctor.setBiography(bio);
        return doctorRepository.save(doctor);
    }

    private Patient createPatient(String fullName, String email, String phone,
                                   LocalDate dob, String address, String emergency) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("Patient@123"));
        user.setPhone(phone);
        user.setRole(Role.PATIENT);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(savedUser);
        patient.setDateOfBirth(dob);
        patient.setAddress(address);
        patient.setEmergencyContact(emergency);
        return patientRepository.save(patient);
    }
}
