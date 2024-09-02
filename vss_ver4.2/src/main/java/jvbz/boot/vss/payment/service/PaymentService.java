package jvbz.boot.vss.payment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.member.repository.MemberRepository;
import jvbz.boot.vss.payment.dto.PaymentDTO;
import jvbz.boot.vss.payment.entity.PaymentHistory;
import jvbz.boot.vss.payment.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MemberRepository memberRepository;

    public void savePayment(PaymentDTO paymentDTO) {
        PaymentHistory paymentHistory = new PaymentHistory();
        paymentHistory.setProductName(paymentDTO.getProductName());
        paymentHistory.setAmount(paymentDTO.getAmount());
        paymentHistory.setPaymentDate(LocalDateTime.now());
        
        // userId로 Member 엔티티를 찾아서 설정
        Member member = memberRepository.findById(paymentDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("Member not found"));
        paymentHistory.setUserId(member);
        
        paymentRepository.save(paymentHistory);
    }

    public List<PaymentHistory> getPaymentHistoryByUserId(String userId) {
    	return paymentRepository.findByUserId_UserId(userId);
    }
}