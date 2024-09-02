package jvbz.boot.vss.comments.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@RequiredArgsConstructor
public class CommentsDTO {
	private Long commentNum;
	private String commentContent;
	private LocalDateTime commentDate;
	private LocalDateTime commentUpdateDate;
	private String userId;
	private Integer videoNum;
}