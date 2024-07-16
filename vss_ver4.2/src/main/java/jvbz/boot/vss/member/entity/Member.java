package jvbz.boot.vss.member.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Lombok 어노테이션(@NoArgsConstructor, @Getter, @Setter)은 각각 기본 생성자, getter 메서드, setter 메서드를 자동 생성한다.
@NoArgsConstructor
@Getter
@Setter
//클래스가 JPA 엔티티임을 나타낸다.
@Entity
public class Member { // 클래스명을 테이블명으로 선언한다.
	// "user_id" 필드가 엔티티의 기본키임을 나타낸다.
	@Id
	@Column(name = "user_id") // @Column은 데이터베이스 컬럼 이름을 지정한다.
	private String userId;

	@Column(name = "user_pw")
	private String userPw;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "user_bdate")
	private String userBdate;

	@Column(name = "user_age")
	private int userAge;

	@Column(name = "user_email")
	private String userEmail;

	@Column(name = "user_phone")
	private String userPhone;

	@Column(name = "user_regdate")
	private LocalDate userRegdate;

	@Column(name = "user_grade")
	private String userGrade;

	@Column(name = "verification_code") // 인증 코드 필드 추가
	private String verificationCode; // 회원 가입 시 인증 코드 저장

}
