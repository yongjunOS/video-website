package jvbz.boot.vss.member.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // 파라미터가 없는 기본 생성자를 자동으로 생성(JPA 엔티티 클래스는 기본 생성자가 반드시 필요)
public class MailDTO {
	
	private String address;
	private String title;
	private String message;
	private String verificationCode;
	private String from; // 보내는 사람 이메일 추가

}
