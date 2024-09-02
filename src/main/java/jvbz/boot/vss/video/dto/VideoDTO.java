package jvbz.boot.vss.video.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class VideoDTO {
	private int videoNum;
	private String videoTitle;
	private String videoFilePath;
	private int videoLikes;
	private int videoViews;
	private String tumbnailPath;
	private String videoDescrip;

	
	private MultipartFile file;
}
