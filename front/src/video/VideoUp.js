import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import EditModal from './modal/EditModal'; // EditModal 컴포넌트 가져오기

const VideoUp = () => {
    const { videoNum } = useParams();
    const [videoDescription, setVideoDescription] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    const fetchVideo = useCallback(async () => {
        try {
            const response = await axios.get(`/api/videos/videosDetail/${videoNum}`);
            setVideoDescription(response.data.videoDescrip); // API 응답에서 비디오 설명을 설정합니다
        } catch (error) {
            console.error('비디오 정보 가져오기 실패: ', error);
        }
    }, [videoNum]);

    useEffect(() => {
        fetchVideo();
    }, [fetchVideo]);

    const handleUpdateSuccess = (newDescription) => {
        setVideoDescription(newDescription); // 새로운 설명으로 상태를 업데이트합니다
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h2>비디오 설명 편집</h2>
            <p>현재 설명: {videoDescription}</p>
            <button onClick={() => setShowEditModal(true)}>설명 편집</button>
            <button onClick={handleBack}>뒤로 가기</button>

            {/* EditModal 렌더링 */}
            <EditModal
                isOpen={showEditModal}
                onRequestClose={() => setShowEditModal(false)}
                videoNum={videoNum}
                initialDescription={videoDescription}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
};

export default VideoUp;
