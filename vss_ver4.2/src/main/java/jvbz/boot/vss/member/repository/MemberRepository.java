package jvbz.boot.vss.member.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import jvbz.boot.vss.member.entity.Member;

//Member 엔티티에 대한 데이터 접근 계층을 정의하며 기본적인 CRUD 작업을 자동으로 제공한다.
public interface MemberRepository extends JpaRepository<Member, String>, JpaSpecificationExecutor<Member>{
	
	// userId로 Member를 찾는 메소드. Spring Data JPA가 메소드 이름을 분석하여 적절한 쿼리를 자동으로 생성한다.
	Member findByUserId(String userId);

	// userEmail과 userPhone으로 Member(userId)를 찾는 메서드
	List<Member> findByUserEmailAndUserPhone(String userEmail, String userPhone);
	
	// userEmail과 userPhone으로 Member(userPw)를 찾는 메서드
	Member findByUserEmailAndUserId(String userEmail, String userId);
	
	Member findByUserEmail(String userEmail);

}
