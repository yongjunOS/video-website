package jvbz.boot.vss.playlists.entity;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jvbz.boot.vss.video.entity.Video;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "playlists")
@Getter
@Setter
public class PlayList {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "playlist_seq")
	@SequenceGenerator(name = "playlist_seq", sequenceName = "playlist_seq", allocationSize = 1)
	@Column(name = "playlist_num")
	private int playlistNum;

	@Column(name = "user_id")
	private String userId;

	@Column(name = "playlist_title")
	private String playlistTitle;

	@Column(name = "playlist_description")
	private String playlistDescription;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}

	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "playlist_videos", joinColumns = @JoinColumn(name = "playlist_num"), inverseJoinColumns = @JoinColumn(name = "video_num"))
	@JsonIgnoreProperties("playlists")
	private Set<Video> videos;
}