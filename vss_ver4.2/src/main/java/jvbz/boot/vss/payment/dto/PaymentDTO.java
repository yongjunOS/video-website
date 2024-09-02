package jvbz.boot.vss.payment.dto;

import lombok.Data;

@Data
public class PaymentDTO {
	private String userId;
    private String productName;
    private int amount;
}
