package jvbz.boot.vss.playlists.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jvbz.boot.vss.playlists.entity.PlayList;

@Repository
public interface PlayListRepository extends JpaRepository<PlayList, Integer> {

	@Query("SELECT p FROM PlayList p LEFT JOIN FETCH p.videos WHERE p.playlistNum = :playlistNum")
	PlayList findByIdWithVideos(@Param("playlistNum") int playlistNum);

	List<PlayList> findAllByOrderByCreatedAtDesc();

	// 추가: 사용자 ID를 기준으로 재생목록 조회하는 메서드
	List<PlayList> findByUserId(String userId);
}
