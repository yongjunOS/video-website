   package jvbz.boot.vss.video.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.inject.Inject;
import jvbz.boot.vss.video.entity.Video;
import jvbz.boot.vss.video.repository.VideoRepository;

@Service
public class VideoService {

	@Inject
	private VideoRepository videoRepository;

	@Transactional
	public Video saveVideo(Video video) {

		return videoRepository.save(video);
	}

	@Transactional(readOnly = true)
	public List<Video> findAllVideos() {
		return videoRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Video findVideosByld(Integer videoNum) {
		return videoRepository.findById(videoNum).orElse(null);
	}

	@Transactional
	public void deleteVideoById(Integer videoNum) {
		videoRepository.deleteById(videoNum);
	}

	@Transactional
	public boolean existById(Integer videoNum) {
		return videoRepository.existsById(videoNum);
	}

	@Transactional
	public Video incrementViews(Integer videoNum) {
		Video video = findVideosByld(videoNum);
		if (video != null) {
			Integer currentViews = video.getVideoViews() != null ? video.getVideoViews() : 0;
			video.setVideoViews(currentViews + 1);
			return saveVideo(video);
		}
		return null;
	}

	@Transactional
	public Video incrementLikes(Integer videoNum) {
		Video video = findVideosByld(videoNum);
		if (video != null) {
			Integer currentLikes = video.getVideoLikes() != null ? video.getVideoLikes() : 0;
			video.setVideoLikes(currentLikes + 1);
			return saveVideo(video);
		}
		return null;
	}

	@Transactional
	public Video decrementLikes(Integer videoNum) {
		Video video = findVideosByld(videoNum);
		if (video != null) {
			Integer currentLikes = video.getVideoLikes() != null ? video.getVideoLikes() : 0;
			if (currentLikes > 0) {
				video.setVideoLikes(currentLikes - 1);
			}
			return saveVideo(video);
		}
		return null;
	}

	@Transactional
	public Video findByFileName(String fileName) {
		return videoRepository.findByVideoFilePathContaining(fileName);
	}

	@Transactional
	public Video getVideoById(Integer videoNum) {
		Optional<Video> video = videoRepository.findById(videoNum);
		return video.orElse(null);
	}

	@Transactional
	public Video extractThumbnailAndSave(Integer videoNum, String videoFilePath, String videoThumbnailPath) {
		Video video = findVideosByld(videoNum);
		if (video != null) {
			String thumbnailFileName = UUID.randomUUID().toString() + ".jpg"; // 임의의 파일명 생성
			String thumbnailOutputPath = videoThumbnailPath + File.separator + thumbnailFileName;

			// 썸네일 저장 디렉토리 확인 및 생성
			File thumbnailDir = new File(videoThumbnailPath);
			if (!thumbnailDir.exists()) {
				thumbnailDir.mkdirs();
			}

			// ffmpeg 명령어 생성
			String ffmpegCommand = "ffmpeg -i \"" + videoFilePath + "\" -ss 00:00:01.000 -vframes 1 \"" + thumbnailOutputPath + "\"";

			// ffmpeg 실행
			try {
				ProcessBuilder builder = new ProcessBuilder("cmd.exe", "/c", ffmpegCommand);
				builder.redirectErrorStream(true);
				Process process = builder.start();

				// 명령어 실행 결과 출력 (디버깅 용도)
				StringBuilder output = new StringBuilder();
				try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
					String line;
					while ((line = reader.readLine()) != null) {
						output.append(line).append("\n");
					}
				}

				int exitCode = process.waitFor();
				if (exitCode != 0) {
					throw new RuntimeException("ffmpeg 명령어 실행 실패, exit code: " + exitCode + "\n" + output);
				}

				// 썸네일 파일 경로를 엔티티에 저장
				video.setVideoThumbnailPath(thumbnailOutputPath);
				saveVideo(video); // 엔티티에 썸네일 경로 저장 후 저장

				return video;
			} catch (IOException | InterruptedException e) {
				// 예외 처리
				e.printStackTrace();
			}
		}
		return null;
	}
}
