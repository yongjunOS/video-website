import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './VideoAll.css';

const Video = ({ video, onVideoSelect, getThumbnailSrc, getVideoSrc }) => {
    const previewDuration = 4;

    const handleMouseEnter = (event) => {
        const videoElement = event.target;
        videoElement.play()
            .then(() => {
                setTimeout(() => {
                    if (!videoElement.paused) {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                    }
                }, previewDuration * 1000); // 4초 동안 재생
            })
            .catch(error => {
                console.error('비디오 재생 실패:', error);
            });
    };

    const handleMouseLeave = (event) => {
        const videoElement = event.target;
        if (!videoElement.paused) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
    };

    const handleTimeUpdate = (event) => {
        const videoElement = event.target;
        if (videoElement.currentTime >= previewDuration) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
    };

    return (
        <div className="video-item">
            <Link to={`/videosDetail/${video.videoNum}`} className="video-link" style={{ textDecoration: "none" }}>
                <video
                    className="video-thumbnail"
                    controls
                    poster={getThumbnailSrc(video.videoNum)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTimeUpdate={handleTimeUpdate}
                    muted
                    preload="metadata"
                >
                    <source src={getVideoSrc(video.videoNum)} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="video-info">
                    <h3 className="video-title">{video.videoTitle}</h3>
                    <p className="video-upload-date">Uploaded: {new Date(video.videoUploadDate).toLocaleDateString('ko-KR')}</p>
                    <p className="video-stats">Likes: {video.videoLikes} | Views: {video.videoViews}</p>
                </div>
            </Link>
        </div>
    );
};

const SideVideoList = ({ currentVideoNum, onVideoSelect }) => {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, []); // 최초 렌더링 시에만 비디오 목록을 불러옴

    const fetchVideos = async () => {
        try {
            const response = await axios.get('/api/videos/videos');
            setVideos(response.data);
        } catch (error) {
            setError(error);
            console.error('Failed to fetch videos: ', error.message);
        }
    };

    const getThumbnailSrc = (videoNum) => `/api/videos/downloadThumbnail/${videoNum}`;
    const getVideoSrc = (videoNum) => `/api/videos/download/${videoNum}`;

    if (error) return <p style={{ color: 'red' }}>Failed to load videos: {error.message}</p>;

    // 현재 재생 중인 비디오(currentVideoNum)를 제외하고 목록을 필터링
    const filteredVideos = videos.filter(video => video.videoNum !== currentVideoNum);

    return (
        <div className="video-container">
            <div className="video-list">
                {filteredVideos.map((video) => (
                    <Video
                        key={video.videoNum}
                        video={video}
                        onVideoSelect={onVideoSelect}
                        getThumbnailSrc={getThumbnailSrc}
                        getVideoSrc={getVideoSrc}
                    />
                ))}
            </div>
        </div>
    );
};

export default SideVideoList;
