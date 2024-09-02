import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VideoUplo.css';

const VideoUplo = ({ userId, userGrade, onClose }) => {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescrip, setVideoDescrip] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const navigate = useNavigate();

    const handleTitleChange = (e) => {
        setVideoTitle(e.target.value);
    };

    const handleDescripChange = (e) => {
        setVideoDescrip(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const validateInputs = () => {
        let valid = true;
        let error = '';

        if (!file) {
            error = 'Please select a video file.';
            valid = false;
        } else if (!videoTitle.trim()) {
            setVideoTitle('내용이 없습니다.');
            error = 'Title is empty. Setting default title.';
            valid = false;
        } else if (!videoDescrip.trim()) {
            setVideoDescrip('내용이 없습니다.');
            error = 'Description is empty. Setting default description.';
            valid = false;
        }

        setUploadError(error);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('videoTitle', videoTitle);
        formData.append('videoDescrip', videoDescrip);
        formData.append('userId', userId);
        formData.append('userGrade', userGrade);

        setUploading(true);
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            const response = await axios.post(`/api/videos/upload`, formData, config);

            if (response.status === 200) {
                console.log('Video upload successful!');
                setUploadSuccess(true);
                setTimeout(() => {
                    onClose();
                    navigate('/list');
                }, 2000); // 2 seconds delay before navigation
            } else {
                setUploadError('Failed to upload the video. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = JSON.stringify(error.response.data);
                setUploadError(`Failed to upload the video: ${errorMessage}`);
                console.error('Video upload error:', error.response.data);
            } else {
                setUploadError('Failed to upload the video. Please try again.');
                console.error('Video upload error:', error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>세부내용 </h2>
            <div>
                <p>{userId}</p>
                <p>나의 등급: {userGrade}</p>
            </div>
            {uploadSuccess && <p className="upload-success">Video uploaded successfully!</p>}
            {uploadError && <p className="upload-error">{uploadError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="videoTitle"> 제 목 </label>
                    <input
                        type="text"
                        className="form-control"
                        id="videoTitle"
                        value={videoTitle}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="videoDescrip"> 내 용 </label>
                    <textarea
                        className="form-control"
                        id="videoDescrip"
                        value={videoDescrip}
                        onChange={handleDescripChange}
                        rows={4}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="file"> 파일 </label>
                    <input
                        type="file"
                        className="form-control-file"
                        id="file"
                        onChange={handleFileChange}
                        accept="video/*"
                        required
                    />
                    {file && (
                        <p className="file-info">추가된 파일: {file.name}</p>
                    )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? '업로딩 중...' : '업로드'}
                </button>
            </form>
        </div>
    );
};

export default VideoUplo;
