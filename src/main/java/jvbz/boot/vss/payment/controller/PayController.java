package jvbz.boot.vss.payment.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

import jakarta.annotation.PostConstruct;
import jakarta.inject.Inject;
import jvbz.boot.vss.payment.dto.PaymentDTO;
import jvbz.boot.vss.payment.entity.PaymentHistory;
import jvbz.boot.vss.payment.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PayController {
    @Value("${iamport.key}")
    private String restApiKey;
    
    @Value("${iamport.secret}")
    private String restApiSecret;

    private IamportClient iamportClient;
    
    @Inject
    private PaymentService paymentService;

    @PostConstruct
    public void init() {
        this.iamportClient = new IamportClient(restApiKey, restApiSecret);
    }

    @PostMapping("/verifyIamport/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable("imp_uid") String imp_uid) throws IamportResponseException, IOException {
        return iamportClient.paymentByImpUid(imp_uid);
    }

    @PostMapping("/savePayment")
    public ResponseEntity<String> savePayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            paymentService.savePayment(paymentDTO);
            return ResponseEntity.ok("Payment saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save payment");
        }
    }

    // 새로운 결제 요청을 처리하는 엔드포인트 추가
    @PostMapping("/requestPayment")
    public ResponseEntity<String> requestPayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            // 여기서 실제 결제 처리를 수행합니다.
            // 결제 성공 시
            savePayment(paymentDTO); // 결제 정보를 저장하는 로직 호출
            return ResponseEntity.ok("결제 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 실패");
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PaymentHistory>> getPaymentHistory(@PathVariable("userId") String userId) {
        try {
            List<PaymentHistory> history = paymentService.getPaymentHistoryByUserId(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
