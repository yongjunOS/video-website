package jvbz.boot.vss.playlists.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jvbz.boot.vss.playlists.entity.PlayList;
import jvbz.boot.vss.playlists.repository.PlayListRepository;
import jvbz.boot.vss.video.entity.Video;
import jvbz.boot.vss.video.repository.VideoRepository;

@Service
public class PlayListService {

	@Autowired
	private PlayListRepository playListRepository;

	@Autowired
	private VideoRepository videoRepository;

	public PlayList createPlaylist(PlayList playlist) {
		return playListRepository.save(playlist);
	}

	public PlayList addVideoToPlaylist(int playlistNum, int videoNum) {
		PlayList playlist = playListRepository.findById(playlistNum)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playlist number: " + playlistNum));
		Video video = videoRepository.findById(videoNum)
				.orElseThrow(() -> new IllegalArgumentException("Invalid video number: " + videoNum));
		playlist.getVideos().add(video);
		return playListRepository.save(playlist);
	}

	public List<PlayList> getAllPlaylists() {
		return playListRepository.findAll();
	}

	public List<PlayList> getPlaylistsByUserId(String userId) {
		return playListRepository.findByUserId(userId);
	}

	// 수정: 반환 타입을 Set<Video>에서 List<Video>로 변경
	public List<Video> getVideosByPlayListNum(int playlistNum) {
		PlayList playlist = playListRepository.findById(playlistNum)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playlist number: " + playlistNum));
		return new ArrayList<>(playlist.getVideos());
	}

	public PlayList updatePlaylist(int id, PlayList playlistDetails) {
		PlayList playlist = playListRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playlist number: " + id));
		playlist.setPlaylistTitle(playlistDetails.getPlaylistTitle());
		playlist.setPlaylistDescription(playlistDetails.getPlaylistDescription());
		return playListRepository.save(playlist);
	}

	public void deletePlaylist(int id) {
		PlayList playlist = playListRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playlist number: " + id));
		playListRepository.delete(playlist);
	}

	public void deleteVideoFromPlaylist(int playlistNum, int videoNum) {
		PlayList playlist = playListRepository.findById(playlistNum)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playlist number: " + playlistNum));
		Video video = videoRepository.findById(videoNum)
				.orElseThrow(() -> new IllegalArgumentException("Invalid video number: " + videoNum));
		playlist.getVideos().remove(video);
		playListRepository.save(playlist);
	}

	public PlayList getPlaylistById(int id) {
		return playListRepository.findById(id).orElse(null);
	}

}