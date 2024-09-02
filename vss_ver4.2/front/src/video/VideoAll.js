import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './modal/Modal';
import VideoUplo from './VideoUplo';
import './VideoAll.css';

const VideoAll = () => {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userGrade, setUserGrade] = useState(null);
    const previewDuration = 3;
    const navigate = useNavigate();

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get('/api/videos/videos');
            setVideos(response.data);
        } catch (error) {
            setError(error);
            console.error('비디오 불러오기 실패: ', error.message);
        }
    }, []);

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await axios.get('/userInfo');
            setUserId(response.data.userId);
            setUserGrade(response.data.userGrade);
        } catch (error) {
            console.error('사용자 정보 불러오기 실패: ', error);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
        fetchUserInfo();
    }, [fetchVideos, fetchUserInfo]);

    const handleViewIncrement = async (videoNum) => {
        try {
            await axios.put(`/api/videos/incrementViews/${videoNum}`);
            fetchVideos(); // 조회수 증가 후 비디오 목록 다시 불러오기
        } catch (error) {
            console.error('조회수 증가 실패: ', error);
        }
    };

    const getVideoSrc = (videoNum) => `/api/videos/download/${videoNum}`;

    const getThumbnailSrc = (video) => `/api/videos/downloadThumbnail/${video.videoNum}`;

    const handleMouseEnter = (event) => {
        const video = event.target;
        video.play()
            .then(() => {
                setTimeout(() => {
                    if (!video.paused) {
                        video.pause();
                        video.currentTime= 0;
                    }
                }, 500); // 필요에 따라 지연 시간 조정
            })
            .catch(error => {
                console.error('비디오 재생 실패:', error);
            });
    };

    const handleMouseLeave = (event) => {
        const video = event.target;
        if (!video.paused) {
            video.pause();
            video.currentTime = 0;
        }
    };

    const handleTimeUpdate = (e) => {
        if (e.target.currentTime >= previewDuration) {
            e.target.pause();
            e.target.currentTime = 0;
        }
    };

    const handleUploadClick = () => {
        if (userId) {
            setIsModalOpen(true);
        } else {
            alert('로그인이 필요합니다.');
            navigate('/login'); // 로그인 페이지로 이동
        }
    };

    return (
        <div className="video-container">
            {error && <p style={{ color: 'red' }}>비디오 로딩 실패: {error.message}</p>}
            <button className="upload-button" onClick={handleUploadClick}>
                <span className="upload-icon">+</span>
                <span className="upload-text">업로드</span>
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <VideoUplo
                    userId={userId}
                    userGrade={userGrade}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchVideos();
                    }}
                />
            </Modal>
            <div className="video-list">
                {videos.map((video) => (
                    <Link key={video.videoNum} to={`/videosDetail/${video.videoNum}`} className="video-link" style={{ textDecoration: "none" }}>
                        <div className="video-item" onClick={() => handleViewIncrement(video.videoNum)}>
                            <video
                                className="video-thumbnail"
                                controls
                                poster={getThumbnailSrc(video)}
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
                                <p className="video-upload-date">업로드 일 : {new Date(video.videoUploadDate).toLocaleDateString('ko-KR')}</p>
                                <p className="video-stats">좋아요: {video.videoLikes} | 조회 : {video.videoViews}</p>
                                {video.userId && (
                                    <p className="video-user-id"> {video.userId.userId}       -       : {video.userId.userGrade}</p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VideoAll;
