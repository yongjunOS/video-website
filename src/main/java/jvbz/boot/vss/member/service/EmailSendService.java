package jvbz.boot.vss.member.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.mail.internet.MimeMessage;
import jvbz.boot.vss.member.dto.MailDTO;

// @Service 어노테이션은 이 클래스가 Spring의 서비스 컴포넌트임을 나타낸다.
@Service
public class EmailSendService {
	// JavaMailSender를 의존성 주입받는다. → 실제 이메일 전송을 담당할 객체
	@Inject
	private JavaMailSender javaMailSender;
	
	// 이메일을 보내는 메서드를 선언한다. MailDTO 객체를 파라미터로 받는다.
	public void sendEmail(MailDTO mailDTO) {
		// MimeMessage 객체를 생성하고, 이를 돕는 MimeMessageHelper 객체를 생성한다. true는 멀티파트 메시지 지원을, "UTF-8"은 문자 인코딩을 지정한다.
		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(mailDTO.getAddress());
			helper.setSubject(mailDTO.getTitle());
			helper.setText(mailDTO.getMessage(), true);
			helper.setFrom("21st_bp@naver.com");

			javaMailSender.send(mimeMessage); // 설정이 완료된 이메일을 실제로 전송한다.
		} catch (Exception e) {
			e.printStackTrace(); // 예외 발생 시 스택 트레이스 출력
			throw new RuntimeException("이메일 전송 중 오류가 발생했습니다.", e); // 예외를 RuntimeException으로 래핑하여 전파
		}
	}

}

