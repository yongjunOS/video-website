package jvbz.boot.vss.payment.repository;

import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.payment.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentHistory, Long> {
	List<PaymentHistory> findByUserId_UserId(String userId);
	void deleteByUserId(Member userId);
}