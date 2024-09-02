package jvbz.boot.vss.video.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.inject.Inject;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import jvbz.boot.vss.video.entity.Video;
import jvbz.boot.vss.video.service.VideoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*") // 모든 도메인에서의 요청 허용
public class VideoController {

	@Inject
	private VideoService videoService;

	public VideoController(VideoService videoService) {
		this.videoService = videoService;
	}

	private final String uploadDir = "C:\\Springboot\\vss\\front\\public\\static\\videos\\";
	private final String thumbnailOutputDir = "C:\\Springboot\\vss\\front\\public\\static\\thumbnails\\";

	// 파일 업로드 엔드포인트 (썸네일 추출 포함)
	@PostMapping("/upload")
	public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("videoTitle") String videoTitle,
			@RequestParam("videoDescrip") String videoDescrip) {
		if (file.isEmpty()) {
			return new ResponseEntity<>("업로드할 파일을 선택해주세요.", HttpStatus.BAD_REQUEST);
		}

		try {
			// 파일 저장 경로 설정
			Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
			Files.createDirectories(uploadPath);

			// 파일 이름 중복 처리
			String fileName = file.getOriginalFilename();
			String filePath = uploadDir + fileName;
			File dest = new File(filePath);
			int fileNum = 0;

			while (dest.exists()) {
				fileNum++;
				String newFileName = fileName.substring(0, fileName.lastIndexOf(".")) + "_" + fileNum + fileName.substring(fileName.lastIndexOf("."));
				filePath = uploadDir + newFileName;
				dest = new File(filePath);
			}

			// 파일 저장
			file.transferTo(dest);

			// 비디오 정보 저장
			Video video = new Video();
			video.setVideoTitle(videoTitle);
			video.setVideoDescrip(videoDescrip);
			video.setVideoFilePath(filePath); // 파일 경로 저장
			video.setVideoUploadDate(LocalDateTime.now());

			// 비디오 저장 및 썸네일 추출
			Video savedVideo = videoService.saveVideo(video);
			videoService.extractThumbnailAndSave(savedVideo.getVideoNum(), savedVideo.getVideoFilePath(), thumbnailOutputDir);

			return new ResponseEntity<>("파일이 성공적으로 업로드되었습니다.", HttpStatus.OK);
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>("파일 업로드 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 모든 비디오 목록 조회
	@GetMapping("/videos")
	public ResponseEntity<List<Video>> getAllVideos() {
		List<Video> videos = videoService.findAllVideos();
		return new ResponseEntity<>(videos, HttpStatus.OK);
	}

	// 특정 비디오 조회
	@GetMapping("/videosDetail/{videoNum}")
	public ResponseEntity<Video> getVideoById(@PathVariable("videoNum") Integer videoNum) {
		Video video = videoService.findVideosByld(videoNum);
		if (video == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(video, HttpStatus.OK);
	}

	// 비디오 정보 수정
	@PutMapping("/videosUpdate/{videoNum}")
	public ResponseEntity<Video> updateVideo(@PathVariable("videoNum") Integer videoNum, @RequestBody Video videoDetails) {
		Video video = videoService.findVideosByld(videoNum);
		if (video != null) {
			video.setVideoTitle(videoDetails.getVideoTitle());
			video.setVideoDescrip(videoDetails.getVideoDescrip());

			Video updateVideoInfo = videoService.saveVideo(video);
			return new ResponseEntity<>(updateVideoInfo, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// 비디오 삭제
	@DeleteMapping("/videosDelete/{videoNum}")
	public ResponseEntity<String> deleteVideo(@PathVariable("videoNum") Integer videoNum) {
		videoService.deleteVideoById(videoNum);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	// 비디오 조회수 증가
	@PutMapping("/incrementViews/{videoNum}")
	public ResponseEntity<Video> incrementViews(@PathVariable("videoNum") Integer videoNum) {
		Video video = videoService.findVideosByld(videoNum);
		if (video == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		// 조회수 증가
		Integer currentViews = video.getVideoViews() != null ? video.getVideoViews() : 0;
		video.setVideoViews(currentViews + 1);

		// DB에 업데이트
		Video updatedVideo = videoService.saveVideo(video);

		return new ResponseEntity<>(updatedVideo, HttpStatus.OK);
	}

	// 비디오 좋아요 수 증가
	@PutMapping("/incrementLikes/{videoNum}")
	public ResponseEntity<Video> incrementLikes(@PathVariable("videoNum") Integer videoNum) {
		Video video = videoService.findVideosByld(videoNum);
		if (video == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		// 좋아요 수 증가
		Integer currentLikes = video.getVideoLikes() != null ? video.getVideoLikes() : 0;
		video.setVideoLikes(currentLikes + 1);

		// DB에 업데이트
		Video updatedVideo = videoService.saveVideo(video);

		return new ResponseEntity<>(updatedVideo, HttpStatus.OK);
	}

	// 비디오 좋아요 수 취소
	@PutMapping("/decrementLikes/{videoNum}")
	public ResponseEntity<Video> decrementLikes(@PathVariable("videoNum") Integer videoNum) {
		Video video = videoService.findVideosByld(videoNum);
		if (video == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		// 좋아요 수 감소
		Integer currentLikes = video.getVideoLikes() != null ? video.getVideoLikes() : 0;
		if (currentLikes > 0) {
			video.setVideoLikes(currentLikes - 1);
		}

		// DB에 업데이트
		Video updatedVideo = videoService.saveVideo(video);

		return new ResponseEntity<>(updatedVideo, HttpStatus.OK);
	}

	@GetMapping("/download/{videoNum}")
	public void downloadFile(@PathVariable("videoNum") Integer videoNum, HttpServletResponse response) {
	    try {
	        // 비디오 정보 조회
	        Video video = videoService.getVideoById(videoNum);
	        if (video == null) {
	            response.setStatus(HttpStatus.NOT_FOUND.value());
	            return;
	        }

	        // 파일 경로 설정
	        Path filePath = Paths.get(video.getVideoFilePath()).toAbsolutePath().normalize();
	        File file = new File(filePath.toUri());
	        
	        if (!file.exists()) {
	            response.setStatus(HttpStatus.NOT_FOUND.value());
	            return;
	        }

	        // 파일 스트리밍 설정
	        response.setContentType("video/mp4");
	        response.setContentLengthLong(file.length());
	        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"");

	        try (ServletOutputStream out = response.getOutputStream();
	             FileInputStream in = new FileInputStream(file)) {
	            byte[] buffer = new byte[2000];
	            int bytesRead;
	            while ((bytesRead = in.read(buffer)) != -1) {
	                out.write(buffer, 0, bytesRead);
	                out.flush();
	            }
	        } catch (SocketTimeoutException e) {
	            System.err.println("Socket timeout exception: " + e.getMessage());
	            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	        }
	    } catch (IOException e) {
	        e.printStackTrace();
	        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	    }
	}


	@GetMapping("/downloadThumbnail/{videoNum}")
	public ResponseEntity<Resource> downloadThumbnail(@PathVariable("videoNum") Integer videoNum) {
		try {
			// 비디오 정보 조회
			Video video = videoService.findVideosByld(videoNum);
			if (video == null || video.getVideoThumbnailPath() == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}

			// 썸네일 파일 경로 설정
			Path thumbnailPath = Paths.get(video.getVideoThumbnailPath()).toAbsolutePath().normalize();
			Resource resource = new UrlResource(thumbnailPath.toUri());

			if (!resource.exists()) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}

			// 이미지 스트리밍 설정
			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"").header(HttpHeaders.CONTENT_TYPE, "image/jpeg")
					.body(resource);
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
