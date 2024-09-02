import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BiLike, BiDislike } from 'react-icons/bi';
import Comments from '../comments/Comments';
import SideVideoList from './SideVideoList';
import SaveModal from './SaveModal';
import EditModal from './modal/EditModal';
import DeleteModal from './modal/DeleteModal';
import './VideoDe.css';

const VideoDe = () => {
    const { videoNum } = useParams();
    const [video, setVideo] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [currentVideoNum, setCurrentVideoNum] = useState(videoNum);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [isModalClosed, setIsModalClosed] = useState(false);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [disliked, setDisliked] = useState(false);

    useEffect(() => {
        const fetchLoggedInUserId = async () => {
            try {
                const response = await axios.get('/api/user/session');
                setLoggedInUserId(response.data.userId);
            } catch (error) {
                console.error('Failed to fetch logged in user: ', error);
            }
        };

        fetchLoggedInUserId();
    }, []);

    const fetchVideo = useCallback(async (videoId) => {
        try {
            const response = await axios.get(`/api/videos/videosDetail/${videoId}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            setVideo(response.data);
            setCurrentVideoNum(response.data.videoNum);
            setLikeCount(response.data.videoLikes);
        } catch (error) {
            console.error('Failed to fetch video: ', error);
        }
    }, []);

    useEffect(() => {
        fetchVideo(videoNum);
    }, [fetchVideo, videoNum]);

    useEffect(() => {
        const checkLiked = async () => {
            try {
                const response = await axios.get(`/api/videos/checkLike/${videoNum}`);
                setLiked(response.data.liked);
            } catch (error) {
                console.error('Failed to check like status: ', error);
            }
        };

        checkLiked();
    }, [videoNum]);

    const handleLike = async () => {
        try {
            if (!liked) {
                await axios.put(`/api/videos/incrementLikes/${videoNum}`);
                setLikeCount(likeCount + 1);
                setLiked(true);
                setDisliked(false);
            } else {
                await axios.put(`/api/videos/decrementLikes/${videoNum}`);
                setLikeCount(likeCount - 1);
                setLiked(false);
            }
        } catch (error) {
            console.error('Failed to like/unlike video: ', error);
        }
    };

    const handleDislike = async () => {
        setDisliked(!disliked);
        if (liked) {
            await axios.put(`/api/videos/decrementLikes/${videoNum}`);
            setLikeCount(likeCount - 1);
            setLiked(false);
        }
    };

    const getVideoSrc = (videoNum) => `/api/videos/download/${videoNum}`;
    const getThumbnailSrc = (videoNum) => `/api/videos/downloadThumbnail/${videoNum}`;

    const handleVideoEnded = (event) => {
        event.target.currentTime = 0;
    };

    const handleVideoSelect = (selectedVideoNum) => {
        navigate(`/videosDetail/${selectedVideoNum}`);
    };

    const handleSave = async (playlistIds, videoId) => {
        try {
            for (const playlistId of playlistIds) {
                await axios.post(`/playlists/${playlistId}/videos/${videoId}`);
            }
        } catch (error) {
            console.error('Error saving video:', error);
        }
    };

    const openSaveModal = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        fetchPlaylists();
        setShowPlaylists(true);
    };

    const closeSaveModal = () => {
        setShowPlaylists(false);
        setIsModalClosed(true);
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    useEffect(() => {
        let timeoutId;
        if (isModalClosed && videoRef.current) {
            timeoutId = setTimeout(() => {
                const playVideo = async () => {
                    try {
                        if (videoRef.current && !videoRef.current.ended && videoRef.current.paused) {
                            if (document.visibilityState === 'visible') {
                                await videoRef.current.play();
                            }
                        }
                    } catch (error) {
                        console.log("Video play failed", error);
                    } finally {
                        setIsModalClosed(false);
                    }
                };
                playVideo();
            }, 500);
        }
        return () => clearTimeout(timeoutId);
    }, [isModalClosed]);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        videoRef.current = null;
    }, [video]);

    const fetchPlaylists = async () => {
        try {
            const response = await axios.get('/playlists/selectAll');
            setPlaylists(response.data);
        } catch (error) {
            console.error('Failed to fetch playlists: ', error);
            setPlaylists([]);
        }
    };

    if (!video) return <p>Loading...</p>;

    return (
        <div className="video-detail-container">
            <div className="video-wrapper">
                <video
                    key={video.videoNum}
                    className="video-player"
                    ref={videoRef}
                    controls
                    poster={getThumbnailSrc(video.videoNum)}
                    onEnded={handleVideoEnded}
                    preload="metadata"
                >
                    <source src={getVideoSrc(video.videoNum)} type="video/mp4" />
                    mp4 확장자 외 동영상은 지원되지 않습니다.
                </video>
            </div>
            <div className="action-buttons">
                <button className={`action-button ${liked ? 'active' : ''}`} onClick={handleLike}>
                    <BiLike />
                    {likeCount}
                </button>
                <button className={`action-button ${disliked ? 'active' : ''}`} onClick={handleDislike}>
                    <BiDislike />
                </button>
                <div className="dropdown">
                    <button className="action-button">⋯</button>
                    <div className="dropdown-content">
                        <button onClick={openSaveModal}>저장</button>
                        <button onClick={handleEdit}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                </div>
            </div>
            <div className="video-info-container">
                <div className="videoDe-info">
				<h2>{video.videoTitle}  <p/> 조회 수: {video.videoViews} º {new Date(video.videoUploadDate).toLocaleDateString('ko-KR')}</h2>
				                    <p>{video.videoDescrip}</p>
                </div>
            </div>
            <div className="side-content">
                <SideVideoList currentVideoNum={currentVideoNum} onVideoSelect={handleVideoSelect} />
            </div>
            <Comments videoNum={videoNum} />
            <SaveModal
                isOpen={showPlaylists}
                onRequestClose={closeSaveModal}
                playlists={playlists}
                videoId={videoNum}
                onSave={handleSave}
            />
            {showEditModal && (
                <EditModal
                    isOpen={showEditModal}
                    onRequestClose={() => setShowEditModal(false)}
                    videoNum={videoNum}
                    initialDescription={video.videoDescrip}
                    onUpdateSuccess={(newDescription) => {
                        setVideo(prevVideo => ({
                            ...prevVideo,
                            videoDescrip: newDescription
                        }));
                    }}
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    isOpen={showDeleteModal}
                    onRequestClose={() => setShowDeleteModal(false)}
                    videoNum={videoNum}
                    onDeleteSuccess={() => {
                        navigate('/videos');
                    }}
                />
            )}
        </div>
    );
};

export default VideoDe;