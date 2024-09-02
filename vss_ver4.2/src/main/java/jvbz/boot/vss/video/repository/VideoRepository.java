package jvbz.boot.vss.video.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jvbz.boot.vss.video.entity.Video;

public interface VideoRepository extends JpaRepository<Video, Integer> {
	 // 파일 경로에 특정 문자열이 포함된 비디오 엔티티 조회
    Video findByVideoFilePathContaining(String fileName);
	
	@Query("SELECT v FROM Video v JOIN v.playlists p WHERE p.playlistNum = :playlistNum")
    List<Video> findVideosByPlayListNum(@Param("playlistNum") int playlistNum);
}
