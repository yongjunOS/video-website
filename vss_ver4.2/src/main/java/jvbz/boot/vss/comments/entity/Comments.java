package jvbz.boot.vss.comments.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jvbz.boot.vss.member.entity.Member;
import jvbz.boot.vss.video.entity.Video;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "COMMENTS")
public class Comments {

   @Id
    @Column(name = "COMMENT_NUM", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "COMMENT_SEQ")
    @SequenceGenerator(name = "COMMENT_SEQ", sequenceName = "COMMENT_SEQ", allocationSize = 1)
    private Long commentNum;

    @Column(name = "comment_content", nullable = false, length = 250)
    private String commentContent;

    @Column(name = "comment_date", nullable = false, updatable = false)
    private LocalDateTime commentDate;

    @Column(name = "comment_update_date")
    private LocalDateTime commentUpdateDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Member userId;

    @ManyToOne
    @JoinColumn(name = "video_num", nullable = false)
    private Video videoNum;
}