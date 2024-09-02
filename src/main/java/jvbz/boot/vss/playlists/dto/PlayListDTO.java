package jvbz.boot.vss.playlists.dto;

import java.util.Set;

import jvbz.boot.vss.video.dto.VideoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class PlayListDTO {

	private int playlistNum;
	private String userId;
	private String playlistTitle;
	private String playlistDescription;
	private Set<VideoDTO> videos; // VideoDTO 객체들의 집합

}
