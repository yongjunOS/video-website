package jvbz.boot.vss.member.spec;

// Spring Data JPA(Java Persistence API)에서 제공하는 인터페이스로 쿼리 조건을
// 객체 지향적인 방식으로 구성할 수 있게 해주어 사용하면 복잡한 동적 쿼리를 쉽게 만들 수 있음.
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jvbz.boot.vss.member.entity.Member;

public class MemberSpecifications { // Member 엔티티에 대한 Specification 정의하는 데 사용함.
	
	// 이 메서드는 userId를 파라미터로 받아 Member 엔티티에 대한 Specification 반환함.
	public static Specification<Member> hasUserId(String userId) {
		
		// 람다 표현식을 사용하여 Specification 인터페이스의 toPredicate(사실이라고 단정하다) 메서드를 구현함.
		// toPredicate 메서드는 Specification 인터페이스에 정의된 추상 메서드.
		// root는 쿼리의 루트 엔티티(Member), query는 쿼리 자체, cb는 조건을 만드는 데 사용되는 CriteriaBuilder 객체임
		return (Root<Member> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			
			// 이 조건문은 userId가 null이거나 비어있는 경우를 처리함.
			// 이런 경우 cb.conjunction()을 반환하여 항상 true인 조건을 생성 → 실질적으로 이 조건을 무시함
			if (userId == null || userId.isEmpty()) {
				return cb.conjunction();
			}
			
			// userId가 유효한 경우, 이 라인은 Member 엔티티의 userId 필드가 주어진 userId와 같은지 비교하는 조건을 생성함.
			return cb.equal(root.get("userId"), userId);
		};
	}

}
