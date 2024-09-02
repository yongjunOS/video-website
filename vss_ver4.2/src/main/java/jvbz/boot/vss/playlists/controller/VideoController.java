//package jvbz.boot.vss.playlists.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import jvbz.boot.vss.playlists.entity.Videos;
//import jvbz.boot.vss.playlists.service.VideoService;
//
//@RestController
//@RequestMapping("/api/videos")
//public class VideoController {
//	@Autowired
//	private VideoService videoService;
//
//	// POST endpoint to create a new video
//	@PostMapping
//	public ResponseEntity<Videos> createVideo(@RequestBody Videos video) {
//		try {
//			Videos createdVideo = videoService.createVideo(video);
//			return ResponseEntity.status(HttpStatus.CREATED).body(createdVideo);
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}
//
//}
