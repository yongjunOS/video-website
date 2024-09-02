package jvbz.boot.vss.playlists.service;


import jvbz.boot.vss.playlists.dto.PlayListDTO;
import jvbz.boot.vss.playlists.entity.PlayList;

public class PlayListMapper {
	public static void toDTO(PlayList playList) {
		PlayListDTO dto = new PlayListDTO();
		dto.setPlaylistNum(playList.getPlaylistNum());
		dto.setUserId(playList.getUserId());
		dto.setPlaylistTitle(playList.getPlaylistTitle());
		dto.setPlaylistDescription(playList.getPlaylistDescription());
	}

}
