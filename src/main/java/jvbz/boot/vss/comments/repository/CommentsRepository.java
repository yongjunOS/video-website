package jvbz.boot.vss.comments.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import jvbz.boot.vss.comments.entity.Comments;
import jvbz.boot.vss.member.entity.Member;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
	
	@Query("SELECT c FROM Comments c ORDER BY c.commentDate ASC")
    List<Comments> findAllOrderByCommentDateAsc();

	List<Comments> findByVideoNumVideoNum(Integer videoNum);
	
	void deleteByUserId(Member userId);
	
}