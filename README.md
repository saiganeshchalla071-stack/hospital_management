# CarePulse | Hospital Management System (HMS)

> **Enterprise Java Full Stack Web Application**  
> Developed with **Java 17, Spring Boot 3.2, Spring Security 6 with JWT, Spring Data JPA, Hibernate, MySQL 8.x**, and a responsive **React 18** frontend with healthcare UI/UX design.

---

## 1. Project Overview

CarePulse digitizes and integrates hospital operations into a unified platform. It reduces paper-based delays and administrative bottlenecks while maintaining strict medical record privacy and scheduling integrity.

### Primary User Roles & Permissions:
1. **System Administrator**:
   - Executive dashboard displaying total doctors, registered patients, departments, appointments, and hospital revenue.
   - Doctor management (onboard new physicians, edit specializations, activate/deactivate accounts).
   - Patient registry management (view patient demographics, toggle account access).
   - Department management (add, edit, and safely delete clinical wings).
   - Hospital-wide appointment queue (approve, reject, complete, or cancel appointments).
   - Financial ledger & billing settlement (review invoices, accept payments across Cash, Card, UPI, and Insurance).
   - System activity and operational quality reports.
2. **Attending Doctor / Physician**:
   - Daily workstation showing today's appointments and upcoming schedule.
   - Assigned appointment queue with patient complaints.
   - Clinical consultation interface to record primary diagnoses, physical findings, and vitals.
   - Electronic prescription management with structured drug dosages, frequencies, and durations.
   - Read/write access restricted strictly to their assigned patients.
3. **Patient**:
   - Self-service registration and portal login.
   - Specialist doctor directory with search and departmental filtering.
   - Conflict-free interactive appointment booking wizard with slot validation.
   - Real-time appointment status tracking (Pending, Approved, Completed, Cancelled).
   - Digital prescription viewer with medication directions.
   - Comprehensive consultation history and diagnostic findings.
   - Transparent billing dashboard with simulated instant payment checkout.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router 6, Axios, Lucide Icons, Custom Healthcare CSS Design System |
| **Backend** | Java 17 LTS, Spring Boot 3.2.3, Spring Security 6, Spring MVC, Spring Data JPA, Hibernate ORM |
| **Security** | JWT (HMAC-SHA256 via JJWT 0.12.5), BCrypt Password Hashing, Role-Based Access Control (RBAC) |
| **Validation** | Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, `@FutureOrPresent`) |
| **Database** | MySQL 8.x (`hospital_management` schema) |
| **Build & Tooling** | Apache Maven 3.9+, Node.js 24+, Postman |

---

## 3. Database Architecture & ER Diagram

```
+---------------+        1:1        +---------------+
|     USERS     | <---------------> |    DOCTORS    |
| (email, hash) |                   +---------------+
+---------------+                           | N:1
        ^                                   v
        | 1:1                       +---------------+
        |                           |  DEPARTMENTS  |
        v                           +---------------+
+---------------+                           |
|   PATIENTS    |                           |
+---------------+                           |
   |         | 1:N                          | 1:N
   |         v                              v
   |    +---------------+  1:1      +---------------+
   |    | APPOINTMENTS  | --------> |     BILLS     |
   |    +---------------+           +---------------+
   |         | 1:1
   |         v
   |    +---------------+  1:1      +--------------------+
   |    |MEDICAL_RECORDS| --------> |   PRESCRIPTIONS    |
   |    +---------------+           +--------------------+
   |                                          | 1:N
   |                                          v
   |                                +--------------------+
   +------------------------------> | PRESCRIPTION_ITEMS |
                                    +--------------------+
```

The database schema is defined in [database/schema.sql](file:///c:/Users/bhavi/Desktop/hospital_management/database/schema.sql) and seed data in [database/sample-data.sql](file:///c:/Users/bhavi/Desktop/hospital_management/database/sample-data.sql).

---

## 4. Default Credentials (Test Accounts)

The application includes an auto-seeding `DataInitializer` that automatically configures demo accounts with BCrypt-hashed passwords upon Spring Boot launch:

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `Admin@123` | Full administrative control |
| **Doctor** | `dr.sarah@hospital.com` | `Doctor@123` | Cardiology Specialist |
| **Doctor** | `dr.michael@hospital.com` | `Doctor@123` | Neurology Specialist |
| **Doctor** | `dr.emily@hospital.com` | `Doctor@123` | Pediatrics Specialist |
| **Doctor** | `dr.david@hospital.com` | `Doctor@123` | Orthopedics Specialist |
| **Patient** | `john.doe@gmail.com` | `Patient@123` | Has completed visit, prescription, and paid bill |
| **Patient** | `jane.smith@gmail.com` | `Patient@123` | Has approved visit and pending bill |
| **Patient** | `robert.j@gmail.com` | `Patient@123` | Has pending appointment |

*(Note: The login page includes convenient **One-Click Demo Fill** buttons for immediate testing).*

---

## 5. Local Setup & Execution Instructions

### Prerequisites
- Java 17 LTS installed
- MySQL 8.x running locally on port 3306 (user `root`, password `root` or updated in `application.properties`)
- Node.js 18+ and npm installed

### Step 1: Database Setup
Make sure MySQL service is running. The database `hospital_management` will be created automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`), or you can run the SQL script manually:
```bash
mysql -u root -proot < database/schema.sql
mysql -u root -proot < database/sample-data.sql
```

### Step 2: Running the Spring Boot Backend
From the root directory or inside `backend/`:
```bash
cd backend
# Using Maven:
mvn spring-boot:run
```
*(Or use the installed Maven binary: `C:\Users\bhavi\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run`)*

The backend will start at **`http://localhost:8080`**.

### Step 3: Running the React Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your web browser.

---

## 6. Running Automated Tests

Run backend unit and validation tests:
```bash
cd backend
mvn test
```
**Test Coverage Includes:**
- `AppointmentServiceTest`: Slot availability, past date validation, and double-booking collision prevention.
- `BillingServiceTest`: Fee calculation, patient settlement, and unauthorized payment rejection.
- `AuthControllerTest`: Authentication, JWT generation, and role authorization payload.

---

## 7. API Testing with Postman

Import [postman/hospital-management-api.json](file:///c:/Users/bhavi/Desktop/hospital_management/postman/hospital-management-api.json) into Postman.

The collection includes pre-configured requests for:
1. `POST /api/auth/login` (Admin, Doctor, Patient)
2. `POST /api/auth/register` (New Patient Registration)
3. `GET /api/doctors/search` & `GET /api/doctors/active`
4. `POST /api/appointments` (Conflict-checked booking)
5. `PATCH /api/appointments/{id}/status` (Approve/Cancel/Complete)
6. `POST /api/medical-records` (Clinical Diagnosis)
7. `POST /api/prescriptions` (Multi-item electronic script)
8. `PATCH /api/bills/{id}/payment-status` (Card/UPI checkout)
9. `GET /api/admin/dashboard`, `/api/doctor/dashboard`, `/api/patient/dashboard`

---

## 8. Security & Production Compliance Considerations

This project was built for educational and demonstration purposes. For enterprise healthcare deployment in production environments:
1. **HIPAA / GDPR Compliance**: All Personal Health Information (PHI) stored in MySQL columns must be encrypted at rest (e.g., using MySQL Transparent Data Encryption or AWS KMS).
2. **Transport Layer Security**: Terminate all external traffic through HTTPS with TLS 1.3 certificates.
3. **HttpOnly Secure Cookies**: Store JWT tokens inside HttpOnly, SameSite=Strict cookies to protect against Cross-Site Scripting (XSS).
4. **Audit Logging**: Store an immutable audit trail (`user_id`, `action`, `patient_id`, `timestamp`, `ip_address`) whenever medical records or prescriptions are viewed or altered.
5. **Rate Limiting**: Protect authentication endpoints against brute-force attacks with Redis-backed Bucket4j rate limiting.
