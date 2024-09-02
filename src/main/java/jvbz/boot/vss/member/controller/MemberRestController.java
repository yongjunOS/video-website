package jvbz.boot.vss.member.controller;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpSession;
import jvbz.boot.vss.member.dto.MailDTO;
import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.member.service.EmailSendService;
import jvbz.boot.vss.member.service.MemberService;
import lombok.RequiredArgsConstructor;

@RestController //RESTful 웹 서비스를 정의하는 컨트롤러로 구성한다.
@RequiredArgsConstructor // Lombok 어노테이션으로, final 필드에 대한 생성자를 자동으로 생성한다.
public class MemberRestController { // Spring Boot를 사용한 RESTful API 컨트롤러
	private static final Logger logger = LogManager.getLogger(MemberRestController.class);

	@Inject // MemberService와 EmailSendService를 의존성을 주입한다.
	private MemberService memberService;

	@Inject
	private EmailSendService emailSendService;

	@PostMapping("/login") // /login 엔드포인트에 대한 POST 요청을 처리한다.
	public ResponseEntity<String> login(@RequestBody Member member, HttpSession session) {
		// 사용자 ID과 비밀번호 가져오기
		String userId = member.getUserId();
		String userPw = member.getUserPw();

		// 사용자 ID와 비밀번호를 받아 인증을 수행한다.
		boolean authenticated = memberService.authenticate(userId, userPw);

		if (authenticated) {
			// 로그인 성공 시 세션에 사용자 아이디 저장
			session.setAttribute("userId", userId);
			if ("admin".equals(userId)) {
				return new ResponseEntity<>("admin", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("user", HttpStatus.OK);
			}
		} else {
			// 로그인 실패 시
			return new ResponseEntity<>("아이디 또는 비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
		}
	}

	// /logout 엔드포인트에 대한 POST 요청을 처리한다.
	@PostMapping("/logout")
	public ResponseEntity<HttpStatus> logout(HttpSession session) {
		// 세션을 무효화한다.
		session.invalidate();
		logger.info("로그 아웃 성공.");
		return new ResponseEntity<>(HttpStatus.OK);
	}

	// /selectAll 엔드포인트에 대한 GET 요청을 처리한다.
	@GetMapping("/selectAll")
	public List<Member> getAllMembers() {
		// 회원 목록을 조회하여 반환한다.
		return memberService.findAllMembers();
	}

	// 특정 회원의 상세 정보를 조회한다.
	@GetMapping("/select/{userId}")
	public ResponseEntity<Member> getMemberById(@PathVariable("userId") String userId) {
		// 특정 회원의 상세 정보를 조회한다.
		Member member = memberService.findMemberById(userId);
		logger.info("member: {}", member);
		if (member != null) {
			if (member.getUserGrade() == null) {
	            member.setUserGrade("Bronze"); // 기본 등급 설정
	        }
			// 회원 정보가 존재하면 200 상태 코드와 함께 회원 정보를 반환한다.
			return new ResponseEntity<>(member, HttpStatus.OK);
		} else {
			// 회원 정보가 존재하지 않으면 404 상태 코드를 반환한다.
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// 인증 번호 요청 엔드포인트
	@PostMapping("/requestVerificationCode")
	public ResponseEntity<Object> requestVerificationCode(@RequestBody Map<String, String> request) {
		String userEmail = request.get("userEmail");

		try {
			String verificationCode = generateVerificationCode(); // 인증 코드 생성
			// 인증 코드를 데이터베이스나 캐시에 저장
			memberService.saveVerificationCode(userEmail, verificationCode);

			// 이메일로 인증 코드 전송
			MailDTO mailDTO = new MailDTO();
			mailDTO.setAddress(userEmail);
			mailDTO.setTitle("회원 가입을 위한 인증 코드");
			mailDTO.setMessage("회원 가입을 완료하려면 인증 코드를 입력해주세요: " + verificationCode);

			emailSendService.sendEmail(mailDTO);

			return ResponseEntity.ok().body(Collections.singletonMap("success", true));
		} catch (Exception e) {
			logger.error("인증 번호 요청 중 오류 발생: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("인증 번호 요청 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 인증 코드 확인 엔드포인트
	@PostMapping("/verifyCode")
	public ResponseEntity<Object> verifyCode(@RequestBody Map<String, String> request) {
		String userEmail = request.get("userEmail");
		String verificationCode = request.get("verificationCode");

		logger.info("이메일 코드 확인: {}", userEmail);

		try {
			boolean isVerified = memberService.verifyCode(userEmail, verificationCode);

			if (isVerified) {
				logger.info("이메일 확인 성공: {}", userEmail);
				return ResponseEntity.ok().body(Collections.singletonMap("success", true));
			} else {
				logger.info("이메일 확인 실패: {}", userEmail);
				return ResponseEntity.badRequest().body(Collections.singletonMap("success", false));
			}
		} catch (Exception e) {
			logger.error("코드 확인 중 오류가 발생했습니다: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("error", "서버 오류가 발생했습니다."));
		}
	}

	// 6자리 랜덤 숫자 생성 메소드
	private String generateVerificationCode() {
		Random random = new Random();
		int code = random.nextInt(900000) + 100000; // 100000 ~ 999999 범위의 랜덤 숫자 생성
		return String.valueOf(code);
	}

	// 신규 회원를 추가하는 POST 요청을 처리한다.
	@PostMapping("/insert")
	public ResponseEntity<String> createMember(@RequestBody Member member) {
		try {
			if (memberService.existsByUserId(member.getUserId())) {
				return new ResponseEntity<>("아이디가 이미 존재합니다.", HttpStatus.BAD_REQUEST);
			}

			// 이메일 인증 확인
			if (!memberService.isEmailVerified(member.getUserEmail())) {
				return new ResponseEntity<>("이메일 인증이 완료되지 않았습니다.", HttpStatus.BAD_REQUEST);
			}

			member.setUserRegdate(LocalDate.now());
			member.setUserGrade("Bronze");

			Member savedMember = memberService.saveMember(member);

			logger.info("회원 가입 성공: {}", savedMember);
			return new ResponseEntity<>("회원 가입에 성공하였습니다.", HttpStatus.CREATED);
		} catch (Exception e) {
			logger.error("회원 가입 중 오류 발생: {}", e.getMessage());
			return new ResponseEntity<>("회원 가입에 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 아이디 중복 확인
	@PostMapping("/checkUserId")
	public ResponseEntity<Boolean> checkUserId(@RequestBody Map<String, String> request) {
		String userId = request.get("userId");
		boolean exists = memberService.existsByUserId(userId);
		return new ResponseEntity<>(!exists, HttpStatus.OK);
	}

	// 회원 정보 조회
	@GetMapping("/userInfo")
	public ResponseEntity<Member> getUserInfo(HttpSession session) {
		// 세션에서 로그인한 사용자의 아이디를 가져옴
		String userId = (String) session.getAttribute("userId");

		if (userId != null) {
			// 사용자 아이디로 회원 정보 조회
			Member member = memberService.findMemberById(userId);

			if (member != null) {
				// 회원 정보가 존재하면 200 상태 코드와 함께 회원 정보를 반환
				return ResponseEntity.ok(member);
			} else {
				// 회원 정보가 존재하지 않으면 404 상태 코드 반환
				return ResponseEntity.notFound().build();
			}
		} else {
			// 로그인되지 않은 경우
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	// 회원 정보를 업데이트한다.
	@PutMapping("/update/{userId}")
	public ResponseEntity<Member> updateMember(@PathVariable("userId") String userId,
			@RequestBody Member memberDetails) {
		// 특정 회원의 장세 정보를 조회한다.
		Member member = memberService.findMemberById(userId);
		if (member != null) {
			// 조회된 회원 정보를 업데이트한다.
			member.setUserPw(memberDetails.getUserPw());
			member.setUserName(memberDetails.getUserName());
			member.setUserBdate(memberDetails.getUserBdate());
			member.setUserAge(memberDetails.getUserAge());
			member.setUserEmail(memberDetails.getUserEmail());
			member.setUserPhone(memberDetails.getUserPhone());
			// 업데이트된 회원 정보를 저장한다.
			Member member2 = memberService.saveMember(member);
			// 업데이트된 회원 정보와 함께 200 상태 코드를 반환한다.
			return new ResponseEntity<>(member2, HttpStatus.OK);
		} else {
			// 회원 정보가 존재하지 않으면 404 상태 코드를 반환한다.
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// 회원 등급 업데이트
	@PutMapping("/updateGrade/{userId}")
	public ResponseEntity<Member> updateMemberGrade(@PathVariable("userId") String userId,
			@RequestBody Member memberDetails, HttpSession session) {
		// 세션에서 현재 로그인한 사용자의 아이디 가져오기
		String currentUserId = (String) session.getAttribute("userId");

		if (currentUserId == null) {
			// 관리자(admin)가 아닌 경우 권한 없음으로 403 Forbidden 반환
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		// 특정 회원의 정보 조회
		Member member = memberService.findMemberById(userId);
		if (member != null) {
			// 조회된 회원의 등급 정보 업데이트
			member.setUserGrade(memberDetails.getUserGrade());
			// 회원 정보 저장
			Member updatedMember = memberService.saveMember(member);
			// 업데이트된 회원 정보와 함께 200 OK 반환
			return ResponseEntity.ok(updatedMember);
		} else {
			// 회원 정보가 존재하지 않는 경우 404 Not Found 반환
			return ResponseEntity.notFound().build();
		}
	}

	// 특정 횐원 정보를 삭제 한다.
	@DeleteMapping("/delete/{userId}")
	public ResponseEntity<HttpStatus> deleteMember(@PathVariable("userId") String userId) {
		try {
			// 회원 정보를 삭제한다.
			memberService.deleteMemberById(userId);
			logger.info("회원 삭제 성공: {}", userId);
			// 204 상태 코드를 반환한다.
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			logger.error("회원 삭제 실패: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 이메일과 전화번호가 일치하는 회원의 아이디 찾기
	@PostMapping("/findId")
	public ResponseEntity<?> findId(@RequestBody Map<String, String> request) {
		String userEmail = request.get("userEmail");
		String userPhone = request.get("userPhone");

		List<Member> members = memberService.findMembersByEmailAndPhone(userEmail, userPhone);
		if (!members.isEmpty()) {
			List<String> userIds = members.stream().map(Member::getUserId).collect(Collectors.toList());
			return ResponseEntity.ok(userIds);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// 아이디와 비밀번호가 일치하면 메일로 비번 전송 엔드 포인트
	@PostMapping("/findPw")
	public ResponseEntity<String> findPd(@RequestBody Map<String, String> request) {
		String userEmail = request.get("userEmail");
		String userId = request.get("userId");

		Member member = memberService.findMemberByEmailAndId(userEmail, userId);

		if (member != null) {
			String newPassword = generateRandomPassword(6); // 6자리 랜덤 비밀번호 생성
			member.setUserPw(newPassword); // 비밀번호 업데이트
			memberService.saveMember(member); // 데이터베이스에 저장

			MailDTO mailDto = new MailDTO();
			mailDto.setAddress(userEmail);
			mailDto.setTitle("VSS 임시 비밀번호");
			mailDto.setMessage("회원님의 임시 비밀번호는: " + newPassword + "입니다.<br>로그인 후 비밀번호를 변경하여 주시기 바랍니다.");

			emailSendService.sendEmail(mailDto);

			return new ResponseEntity<>("임시 비밀번호를 가입하신 이메일로 전송하였습니다.", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("일치하는 회원 정보가 없습니다.", HttpStatus.NOT_FOUND);
		}
	}

	private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
	private static final SecureRandom random = new SecureRandom();

	private String generateRandomPassword(int length) {
		StringBuilder password = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			password.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
		}
		return password.toString();
	}

}
