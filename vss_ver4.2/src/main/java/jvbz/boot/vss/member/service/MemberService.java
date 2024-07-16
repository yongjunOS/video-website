package jvbz.boot.vss.member.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.inject.Inject;
import jvbz.boot.vss.comments.repository.CommentsRepository;
import jvbz.boot.vss.inquiry.repository.InquiryRepository;
import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.member.repository.MemberRepository;
import jvbz.boot.vss.member.spec.MemberSpecifications;
import jvbz.boot.vss.payment.repository.PaymentRepository;

@Service // 이 클래스가 서비스 계층의 컴포넌트임을 나타낸다.
public class MemberService {
	private static final Logger logger = LogManager.getLogger(MemberService.class);
	
	// 필요한 리포지토리들을 의존성 주입받기 위한 필드들을 선언한다.
	private final MemberRepository memberRepository;
	private final CommentsRepository commentsRepository;
	private final InquiryRepository inquiryRepository;
	private final PaymentRepository paymentRepository;

	// 인증 코드 저장을 위한 임시 저장소
	private Map<String, String> verificationCodes = new HashMap<>();
	private Map<String, Boolean> emailVerificationStatus = new HashMap<>();

	@Inject // 생성자를 통해 의존성 주입을 받는다.
	public MemberService(MemberRepository memberRepository, CommentsRepository commentsRepository,
			InquiryRepository inquiryRepository, PaymentRepository paymentRepository) {
		this.memberRepository = memberRepository;
		this.commentsRepository = commentsRepository;
		this.inquiryRepository = inquiryRepository;
		this.paymentRepository = paymentRepository;
	}

	// 메서드 실행 시 트랜잭션이 시작되고 정상적으로 종료되면 트랜잭션이 커밋된다.
	@Transactional
	public Member saveMember(Member member) {
		// Member 엔티티를 저장하고 저장된 엔티티를 반환한다.
		return memberRepository.save(member);
	}
	
	// 인증 코드 저장
	public void saveVerificationCode(String email, String code) {
		verificationCodes.put(email, code);
		emailVerificationStatus.put(email, false);
	}

	// 인증 코드 확인
	public boolean verifyCode(String email, String code) {
	    logger.info("이메일 코드 확인: {}", email);
	    String savedCode = verificationCodes.get(email);
	    logger.info("저장된 코드: {}, 수신된 코드: {}", savedCode, code);
	    if (savedCode != null && savedCode.equals(code)) {
	        emailVerificationStatus.put(email, true);
	        logger.info("이메일 확인 성공: {}", email);
	        return true;
	    }
	    logger.info("이메일 확인 실패: {}", email);
	    return false;
	}

	// 이메일 인증 상태 확인
	public boolean isEmailVerified(String email) {
		Boolean status = emailVerificationStatus.get(email);
		return status != null && status;
	}

	// 읽기 전용 트랜잭션으로 데이터 변경 작업을 허용하지 않으며 성능 최적화에 도움이 된다.
	@Transactional(readOnly = true)
	public List<Member> findAllMembers() {
		// 모든 Member 엔티티를 조회하고 리스트로 반환한다.
		return memberRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Member findMemberById(String userId) {
		// ID로 Member 엔티티를 조회하고 존재하지 않으면 null을 반환한다.
		return memberRepository.findById(userId).orElse(null);
	}

	// 이메일과 전화번호로 회원을 조회하는 로직
	// 이메일과 전화번호가 일치하는 모든 회원을 찾아서 반환
	@Transactional(readOnly = true)
	public List<Member> findMembersByEmailAndPhone(String userEmail, String userPhone) {
		// 이메일과 전화번호로 Member 엔티티를 조회하고 존재하지 않으면 null을 반환한다.
		return memberRepository.findByUserEmailAndUserPhone(userEmail, userPhone);
	}

	// 비밀번호 찾기
	@Transactional(readOnly = true)
	public Member findMemberByEmailAndId(String userEmail, String userId) {
		// 이메일과 전화번호로 Member 엔티티를 조회하고 존재하지 않으면 null을 반환한다.
		return memberRepository.findByUserEmailAndUserId(userEmail, userId);
	}

	@Transactional
	public void deleteMemberById(String userId) {
		// 동적 쿼리를 사용하여 삭제할 회원을 조회
		List<Member> members = memberRepository.findAll(MemberSpecifications.hasUserId(userId));

		for (Member member : members) {
			// 자식 엔터티 삭제
			commentsRepository.deleteByUserId(member);
			inquiryRepository.deleteByUserId(member.getUserId());
			paymentRepository.deleteByUserId(member);
			// 부모 엔터티 삭제
			memberRepository.delete(member);
		}
	}
	
	public boolean existsByUserId(String userId) {
		// ID로 Member 엔티티의 존재 여부를 확인하고, 결과를 반환한다.
		return memberRepository.existsById(userId);
	}
	
	public boolean authenticate(String userId, String userPw) {
		Member member = memberRepository.findByUserId(userId);
		if (member != null && member.getUserPw().equals(userPw)) {
			return true;
		}
		return false;
	}
	
	// 이메일로 회원을 조회하는 메서드
	@Transactional(readOnly = true)
	public Member findMemberByEmail(String userEmail) {
		return memberRepository.findByUserEmail(userEmail);
	}

}
