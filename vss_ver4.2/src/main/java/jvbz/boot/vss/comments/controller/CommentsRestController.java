package jvbz.boot.vss.comments.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import jvbz.boot.vss.comments.dto.CommentsDTO;
import jvbz.boot.vss.comments.entity.Comments;
import jvbz.boot.vss.comments.repository.CommentsRepository;
import jvbz.boot.vss.comments.service.CommentsService;
import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.member.repository.MemberRepository;

@RestController
@RequestMapping("/comments")
public class CommentsRestController {

   @Inject
   private CommentsService commentsService;

   @Autowired
   private CommentsRepository commentsRepository;

   @Autowired
   private MemberRepository memberRepository;

   @GetMapping("/selectAll/{videoNum}")
    public ResponseEntity<List<Comments>> getCommentsByVideoId(@PathVariable("videoNum") Integer videoNum) {
        List<Comments> comments = commentsService.findCommentsByVideoNum(videoNum);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

   @GetMapping("/select/{commentNum}")
   public ResponseEntity<Comments> getCommentsById(@PathVariable("commentNum") Long commentNum) {
      Comments comments = commentsService.findCommentsById(commentNum);
      if (comments != null) {
         return new ResponseEntity<>(comments, HttpStatus.OK);
      } else {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   @PostMapping("/insert")
   public ResponseEntity<String> insertComment(@RequestBody CommentsDTO commentsDTO) {
       try {
           commentsService.saveComments(commentsDTO);
           return ResponseEntity.ok("댓글이 저장되었습니다.");
       } catch (Exception e) {
           return new ResponseEntity<>("댓글 저장에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
       }
   }

   @PutMapping("/update/{commentNum}")
   public ResponseEntity<String> updateComment(@PathVariable("commentNum") Long commentNum,
         @RequestBody CommentsDTO commentsDTO) {
      Comments comment = commentsRepository.findById(commentNum)
            .orElseThrow(() -> new RuntimeException("Comment not found"));

      Member member = memberRepository.findById(commentsDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

      comment.setCommentContent(commentsDTO.getCommentContent());
      comment.setCommentUpdateDate(LocalDateTime.now());
      comment.setUserId(member);
      commentsRepository.save(comment);

      return ResponseEntity.ok("댓글이 수정되었습니다.");
   }

   @DeleteMapping("/delete/{commentNum}")
   public ResponseEntity<String> deleteComments(@PathVariable("commentNum") Long commentNum) {
      try {
         commentsService.deleteCommentsById(commentNum);
         return new ResponseEntity<>("댓글이 삭제되었습니다.", HttpStatus.NO_CONTENT);
      } catch (Exception e) {
         return new ResponseEntity<>("댓글 삭제에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   // 모든 댓글을 페이징하여 가져오는 관리자용 엔드포인트
   @GetMapping("/admin/all")
    public ResponseEntity<Page<Comments>> getAllCommentsForAdmin(Pageable pageable) {
        Page<Comments> comments = commentsService.getAllComments(pageable);
        return ResponseEntity.ok(comments);
    }
}
