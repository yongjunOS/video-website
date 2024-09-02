package jvbz.boot.vss.member.dto;

import java.time.LocalDate;

import lombok.Data;

/* Lombok의 @Data 어노테이션을 클래스에 적용하고 다음의 기능을 자동으로 생성해준다.
 * - 모든 필드에 대한 getter와 setter
 * - toString() 메서드
 * - 기본 생성자
 * */
@Data
public class MemberDTO {
	
	private String user_id;
	private String user_pw;
	private String user_name;
	private String user_bdate;
	private int user_age;
	private String user_email;
	private String user_phone;
	private LocalDate user_regdate;
	private String user_grade;
	
}
