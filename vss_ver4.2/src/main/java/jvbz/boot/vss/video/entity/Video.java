package jvbz.boot.vss.video.entity;

import java.time.LocalDateTime;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jvbz.boot.vss.playlists.entity.PlayList;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Video")
public class Video {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@SequenceGenerator(name = "video_num_seq", sequenceName = "VIDEO_NUM_SEQ", allocationSize = 1)
	@Column(name = "VIDEO_NUM", nullable = false)
	private Integer videoNum; // PK

	@Column(name = "VIDEO_TITLE")
	private String videoTitle;

	@Column(name = "VIDEO_DESCRIP")
	private String videoDescrip;

	@Column(name = "VIDEO_FILEPATH")
	private String videoFilePath;

	@Column(name = "VIDEO_LIKES")
	private Integer videoLikes;

	@Column(name = "VIDEO_VIEWS")
	private Integer videoViews;

	@Column(name = "VIDEO_THUMBNAILPATH")
	private String videoThumbnailPath;

	@Column(name = "VIDEO_UPLOAD_DATE")
	private LocalDateTime videoUploadDate;

	@ManyToMany(mappedBy = "videos", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JsonIgnore
	private Set<PlayList> playlists;

	public void removeFromPlaylists() {
		for (PlayList playlist : this.playlists) {
			playlist.getVideos().remove(this);
		}
		this.playlists.clear();
	}

//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private Member userId;

}