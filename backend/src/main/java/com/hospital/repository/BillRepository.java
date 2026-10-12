package com.hospital.repository;

import com.hospital.entity.Bill;
import com.hospital.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByPatientIdOrderByBillingDateDesc(Long patientId);
    Optional<Bill> findByAppointmentId(Long appointmentId);
    List<Bill> findByPaymentStatusOrderByBillingDateDesc(PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b WHERE b.paymentStatus = 'PAID'")
    BigDecimal calculateTotalPaidRevenue();

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b WHERE b.paymentStatus = 'PENDING'")
    BigDecimal calculateTotalPendingRevenue();

    long countByPaymentStatus(PaymentStatus paymentStatus);
}
