package jvbz.boot.vss.comments.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.inject.Inject;
import jvbz.boot.vss.comments.dto.CommentsDTO;
import jvbz.boot.vss.comments.entity.Comments;
import jvbz.boot.vss.comments.repository.CommentsRepository;
import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.member.repository.MemberRepository;
import jvbz.boot.vss.video.entity.Video;
import jvbz.boot.vss.video.repository.VideoRepository;

@Service
public class CommentsService {
   @Inject
   private CommentsRepository commentsRepository;

   @Inject
   private MemberRepository memberRepository;
   
   @Inject
    private VideoRepository videoRepository;

   @Transactional(readOnly = true)
   public List<Comments> findAllComments() {
      return commentsRepository.findAllOrderByCommentDateAsc();
   }

   @Transactional(readOnly = true)
   public Comments findCommentsById(Long commentNum) {
      return commentsRepository.findById(commentNum).orElse(null);
   }
   
   @Transactional(readOnly = true)
    public List<Comments> findCommentsByVideoNum(Integer videoNum) {
        return commentsRepository.findByVideoNumVideoNum(videoNum);
    }

   @Transactional
   public void saveComments(CommentsDTO commentsDTO) {
        Comments comment = new Comments();
        Video video = videoRepository.findById(commentsDTO.getVideoNum())
                                     .orElseThrow(() -> new IllegalArgumentException("Invalid videoNum: " + commentsDTO.getVideoNum()));
        Member user = memberRepository.findById(commentsDTO.getUserId())
                                     .orElseThrow(() -> new IllegalArgumentException("Invalid userId: " + commentsDTO.getUserId()));
        comment.setVideoNum(video);
        comment.setUserId(user);
        comment.setCommentContent(commentsDTO.getCommentContent());
        comment.setCommentDate(LocalDateTime.now());
        commentsRepository.save(comment);
    }

   @Transactional
   public void updateComments(CommentsDTO commentsDTO) {
      Member member = memberRepository.findById(commentsDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

      Comments comment = commentsRepository.findById(commentsDTO.getCommentNum())
            .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

      comment.setCommentContent(commentsDTO.getCommentContent());
      comment.setCommentUpdateDate(commentsDTO.getCommentUpdateDate());
      comment.setUserId(member);

      commentsRepository.save(comment);
   }

   @Transactional
   public void deleteCommentsById(Long commentNum) {
      commentsRepository.deleteById(commentNum);
   }

   @Transactional(readOnly = true)
   public long countComments() {
      return commentsRepository.count();
   }

   public boolean existsByCommentNum(Long commentNum) {
      return commentsRepository.existsById(commentNum);
   }
   
   //관리자용 서비스
   public Page<Comments> getAllComments(Pageable pageable) {
        return commentsRepository.findAll(pageable);
    }
}
