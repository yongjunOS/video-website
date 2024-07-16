package jvbz.boot.vss.payment.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jvbz.boot.vss.member.entity.Member;
import lombok.Data;

@Data
@Entity
@Table(name = "PAYMENT_HISTORY")
public class PaymentHistory {
    @Id
    @Column(name = "PAYMENT_NUM", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PAYMENT_SEQ")
    @SequenceGenerator(name = "PAYMENT_SEQ", sequenceName = "PAYMENT_SEQ", allocationSize = 1)
    private Long paymentNum;

    @Column(name = "PRODUCT_NAME", nullable = false)
    private String productName;

    @Column(name = "AMOUNT", nullable = false)
    private int amount;

    @Column(name = "PAYMENT_DATE", nullable = false)
    private LocalDateTime paymentDate;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Member userId;
}