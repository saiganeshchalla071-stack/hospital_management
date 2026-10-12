-- ==============================================================
-- Hospital Management System - Sample Data
-- Database: hospital_management
-- Default Passwords:
--   Admin:   Admin@123
--   Doctors: Doctor@123
--   Patients: Patient@123
-- Note: Spring Boot DataInitializer also auto-provisions or syncs
--       these accounts using BCryptPasswordEncoder on startup.
-- ==============================================================

USE hospital_management;

-- 1. USERS
-- Standard BCrypt Hash for 'Admin@123': $2a$10$wE96mE94gN/g9b4m2qG9veY3yvQfPZ0p9v9K3a3J1a2e3r4t5y6u7
-- Standard BCrypt Hash for 'password123': $2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy
INSERT INTO users (id, full_name, email, password_hash, phone, role, enabled, created_at) VALUES
(1, 'System Administrator', 'admin@hospital.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0100', 'ADMIN', TRUE, NOW()),
(2, 'Dr. Sarah Jenkins', 'dr.sarah@hospital.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0111', 'DOCTOR', TRUE, NOW()),
(3, 'Dr. Michael Chang', 'dr.michael@hospital.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0112', 'DOCTOR', TRUE, NOW()),
(4, 'Dr. Emily Rodriguez', 'dr.emily@hospital.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0113', 'DOCTOR', TRUE, NOW()),
(5, 'Dr. David Kim', 'dr.david@hospital.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0114', 'DOCTOR', TRUE, NOW()),
(6, 'John Doe', 'john.doe@gmail.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0121', 'PATIENT', TRUE, NOW()),
(7, 'Jane Smith', 'jane.smith@gmail.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0122', 'PATIENT', TRUE, NOW()),
(8, 'Robert Johnson', 'robert.j@gmail.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0123', 'PATIENT', TRUE, NOW()),
(9, 'Maria Garcia', 'maria.g@gmail.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0124', 'PATIENT', TRUE, NOW()),
(10, 'David Wilson', 'david.w@gmail.com', '$2a$10$eACCYoNO3qHYOVDTrNpBOOP7j5I565G5M5qY1aBfZt6MhWdC0s1vy', '+1-555-0125', 'PATIENT', TRUE, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. DEPARTMENTS
INSERT INTO departments (id, name, description, location) VALUES
(1, 'Cardiology', 'Comprehensive care for coronary diseases, heart failure, and cardiovascular diagnostics.', 'Wing A - 2nd Floor, Suite 201'),
(2, 'Neurology', 'Specialized care for neurological disorders, epilepsy, stroke, and central nervous system health.', 'Wing B - 3rd Floor, Suite 305'),
(3, 'Pediatrics', 'Comprehensive healthcare, pediatric vaccines, and wellness exams for infants and adolescents.', 'Wing C - 1st Floor, Suite 102'),
(4, 'Orthopedics', 'Advanced treatment for bone fractures, arthritis, joint replacements, and sports injuries.', 'Wing A - 1st Floor, Suite 115'),
(5, 'General Medicine', 'Primary care, preventive screenings, acute illness diagnosis, and outpatient consultations.', 'Main Block - Ground Floor, Suite 10')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. DOCTORS
INSERT INTO doctors (id, user_id, department_id, specialization, qualification, experience_years, consultation_fee, biography) VALUES
(1, 2, 1, 'Interventional Cardiology', 'MBBS, MD (Cardiology), FACC', 12, 150.00, 'Dr. Sarah Jenkins has over a decade of clinical experience in interventional cardiology, echocardiography, and preventive heart care.'),
(2, 3, 2, 'Clinical Neurology', 'MD, DM (Neurology), FAAN', 9, 180.00, 'Dr. Michael Chang specializes in stroke management, migraine disorders, neurodegenerative conditions, and diagnostic EEG.'),
(3, 4, 3, 'Pediatric Medicine', 'MBBS, DCH, MD (Pediatrics)', 7, 120.00, 'Dr. Emily Rodriguez is dedicated to child healthcare, developmental milestones, pediatric emergency care, and immunization programs.'),
(4, 5, 4, 'Orthopedic Surgery', 'MS (Orthopedics), MCh (Joints)', 15, 200.00, 'Dr. David Kim is a leading orthopedic surgeon with extensive expertise in minimally invasive joint replacements and sports medicine.')
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

-- 4. PATIENTS
INSERT INTO patients (id, user_id, date_of_birth, address, emergency_contact) VALUES
(1, 6, '1985-04-12', '124 Maple Street, Metropolis, NY 10001', '+1-555-0991'),
(2, 7, '1992-08-25', '782 Oak Avenue, Metropolis, NY 10002', '+1-555-0992'),
(3, 8, '1978-11-03', '340 Pine Road, Metropolis, NY 10003', '+1-555-0993'),
(4, 9, '1995-02-17', '512 Elm Boulevard, Metropolis, NY 10004', '+1-555-0994'),
(5, 10, '1989-06-30', '901 Cedar Lane, Metropolis, NY 10005', '+1-555-0995')
ON DUPLICATE KEY UPDATE address=VALUES(address);

-- 5. APPOINTMENTS
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, start_time, end_time, reason, status, created_at) VALUES
(1, 1, 1, '2026-10-05', '09:00:00', '09:30:00', 'Routine cardiac checkup and occasional palpitations after exercise.', 'COMPLETED', NOW()),
(2, 2, 2, '2026-10-12', '10:00:00', '10:30:00', 'Recurrent tension headaches and dizziness in the morning.', 'APPROVED', NOW()),
(3, 3, 3, '2026-10-14', '11:00:00', '11:30:00', 'Seasonal allergies, cough, and child immunization follow-up.', 'PENDING', NOW()),
(4, 4, 4, '2026-10-06', '14:00:00', '14:30:00', 'Right knee pain after playing tennis and mild swelling.', 'COMPLETED', NOW()),
(5, 5, 1, '2026-10-15', '15:00:00', '15:30:00', 'Hypertension follow-up consultation and medication review.', 'APPROVED', NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 6. MEDICAL RECORDS
INSERT INTO medical_records (id, patient_id, doctor_id, appointment_id, diagnosis, clinical_notes, created_at) VALUES
(1, 1, 1, 1, 'Benign Sinus Tachycardia & Stage 1 Essential Hypertension', 'BP: 138/88 mmHg, HR: 82 bpm. Resting ECG shows regular sinus rhythm without ischemic changes. Advised sodium reduction and moderate aerobic exercise.', NOW()),
(2, 4, 4, 4, 'Grade I Medial Meniscal Strain (Right Knee)', 'Physical exam revealed medial joint line tenderness without ligamentous laxity. Lachman test negative. Advised R.I.C.E. therapy and physical rehabilitation.', NOW())
ON DUPLICATE KEY UPDATE diagnosis=VALUES(diagnosis);

-- 7. PRESCRIPTIONS
INSERT INTO prescriptions (id, patient_id, doctor_id, medical_record_id, prescription_date, instructions, created_at) VALUES
(1, 1, 1, 1, '2026-10-05', 'Take medications with food. Monitor blood pressure twice weekly in the morning.', NOW()),
(2, 4, 4, 2, '2026-10-06', 'Apply cold pack for 15 minutes twice daily. Wear supportive knee sleeve during walking.', NOW())
ON DUPLICATE KEY UPDATE instructions=VALUES(instructions);

-- 8. PRESCRIPTION ITEMS
INSERT INTO prescription_items (id, prescription_id, medicine_name, dosage, frequency, duration, additional_instructions) VALUES
(1, 1, 'Amlodipine Besylate', '5mg', 'Once daily in morning (1-0-0)', '30 days', 'Do not skip doses. Report ankle swelling.'),
(2, 1, 'Metoprolol Tartrate', '25mg', 'Twice daily after meals (1-0-1)', '30 days', 'Check pulse before taking.'),
(3, 2, 'Ibuprofen', '400mg', 'Twice daily as needed (1-0-1)', '5 days', 'Take strictly with food or milk to prevent gastric upset.'),
(4, 2, 'Glucosamine Sulfate', '500mg', 'Once daily (1-0-0)', '60 days', 'Joint cartilage nutritional supplement.')
ON DUPLICATE KEY UPDATE medicine_name=VALUES(medicine_name);

-- 9. BILLS
INSERT INTO bills (id, patient_id, appointment_id, amount, billing_date, payment_status, payment_method, description) VALUES
(1, 1, 1, 150.00, '2026-10-05', 'PAID', 'CARD', 'Consultation fee with Dr. Sarah Jenkins (Cardiology) - Paid via Visa ending in 4242.'),
(2, 2, 2, 180.00, '2026-10-12', 'PENDING', 'CASH', 'Scheduled consultation fee with Dr. Michael Chang (Neurology).'),
(3, 4, 4, 200.00, '2026-10-06', 'PAID', 'UPI', 'Consultation & joint physical evaluation with Dr. David Kim (Orthopedics) - Paid via UPI.'),
(4, 5, 5, 150.00, '2026-10-15', 'PENDING', 'CARD', 'Scheduled consultation fee with Dr. Sarah Jenkins (Cardiology).')
ON DUPLICATE KEY UPDATE amount=VALUES(amount);
