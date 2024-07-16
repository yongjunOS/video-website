package jvbz.boot.vss.playlists.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jvbz.boot.vss.playlists.dto.PlayListDTO;
import jvbz.boot.vss.video.dto.VideoDTO;
import jvbz.boot.vss.playlists.entity.PlayList;
import jvbz.boot.vss.video.entity.Video;
import jvbz.boot.vss.playlists.service.PlayListService;

@RestController
@RequestMapping("/playlists")
public class PlayListController {

	private static final Logger logger = LogManager.getLogger(PlayListController.class);

	@Autowired
	private PlayListService playListService;

	@PostMapping
	public ResponseEntity<?> createPlaylist(@Valid @RequestBody PlayList playlist, BindingResult result,
			HttpSession session) {
		if (result.hasErrors()) {
			// 유효성 검사 에러 처리
			return ResponseEntity.badRequest().body("Validation errors");
		}

		try {
			// 현재 로그인한 사용자의 ID 가져오기
			String userId = (String) session.getAttribute("userId");
			playlist.setUserId(userId);

			PlayList createdPlaylist = playListService.createPlaylist(playlist);
			return ResponseEntity.ok(createdPlaylist);
		} catch (Exception e) {
			logger.error("Failed to create playlist", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/{playlistNum}/videos/{videoNum}")
	public ResponseEntity<PlayList> addVideoToPlaylist(@PathVariable("playlistNum") int playlistNum,
			@PathVariable("videoNum") int videoNum) {
		try {
			PlayList updatedPlaylist = playListService.addVideoToPlaylist(playlistNum, videoNum);
			return ResponseEntity.ok(updatedPlaylist);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@GetMapping("/selectAll")
	public List<PlayList> getAllPlaylists(HttpSession session) {
		// 현재 로그인한 사용자의 ID 가져오기
		String userId = (String) session.getAttribute("userId");
		return playListService.getPlaylistsByUserId(userId);
	}

	@GetMapping("/{playlistNum}")
	public PlayListDTO getPlayList(@PathVariable("playlistNum") int playlistNum) {
		try {
			List<Video> videos = playListService.getVideosByPlayListNum(playlistNum);

			// Mapping Videos entities to VideoDTO objects
			Set<VideoDTO> videoDTOs = videos.stream().map(video -> {
				VideoDTO videoDTO = new VideoDTO();
				videoDTO.setVideoNum(video.getVideoNum());
				videoDTO.setVideoTitle(video.getVideoTitle());
				videoDTO.setVideoFilePath(video.getVideoFilePath());
				videoDTO.setTumbnailPath(video.getVideoThumbnailPath());
				return videoDTO;
			}).collect(Collectors.toSet());

			// Create PlayListDTO and populate with fetched data
			PlayListDTO playlistDTO = new PlayListDTO();
			playlistDTO.setPlaylistNum(playlistNum); // Use the provided playlistNum
			// Set other fields as needed, assuming they are fetched from
			// playListService.getPlayListWithVideos(playlistNum)
			// playlistDTO.setUserId(playList.getUserId());
			// playlistDTO.setPlaylistTitle(playList.getPlaylistTitle());
			// playlistDTO.setPlaylistDescription(playList.getPlaylistDescription());
			playlistDTO.setVideos(videoDTOs);

			return playlistDTO;
		} catch (Exception e) {
			logger.error("Failed to fetch playlist with playlistNum: {}", playlistNum, e);
			throw e;
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<PlayList> updatePlaylist(@PathVariable("id") int id, @RequestBody PlayList playlistDetails,
			HttpSession session) {
		// 현재 로그인한 사용자의 ID 가져오기
		String userId = (String) session.getAttribute("userId");

		// 재생목록의 소유자인지 확인
		PlayList existingPlaylist = playListService.getPlaylistById(id);
		if (existingPlaylist == null || !existingPlaylist.getUserId().equals(userId)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		return ResponseEntity.ok(playListService.updatePlaylist(id, playlistDetails));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePlaylist(@PathVariable("id") int id, HttpSession session) {
		// 현재 로그인한 사용자의 ID 가져오기
		String userId = (String) session.getAttribute("userId");

		// 재생목록의 소유자인지 확인
		PlayList existingPlaylist = playListService.getPlaylistById(id);
		if (existingPlaylist == null || !existingPlaylist.getUserId().equals(userId)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		playListService.deletePlaylist(id);
		return ResponseEntity.noContent().build();
	}

	// 추가: 재생목록에서 동영상 삭제하는 메서드
	@DeleteMapping("/{playlistNum}/videos/{videoNum}")
	public ResponseEntity<Void> deleteVideoFromPlaylist(@PathVariable("playlistNum") int playlistNum,
			@PathVariable("videoNum") int videoNum, HttpSession session) {
		// 현재 로그인한 사용자의 ID 가져오기
		String userId = (String) session.getAttribute("userId");

		// 재생목록의 소유자인지 확인
		PlayList existingPlaylist = playListService.getPlaylistById(playlistNum);
		if (existingPlaylist == null || !existingPlaylist.getUserId().equals(userId)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		try {
			playListService.deleteVideoFromPlaylist(playlistNum, videoNum);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			logger.error("Failed to delete video {} from playlist {}", videoNum, playlistNum, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}