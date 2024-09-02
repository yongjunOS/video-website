import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const VideoDel = () => {
    const { videoNum } = useParams();
    const navigate = useNavigate();
    const [videoInfo, setVideoInfo] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
	

    useEffect(() => {
        const fetchVideoInfo = async () => {
            try {
                const response = await axios.get(`/api/videos/videosDetail/${videoNum}`); // Adjust path if necessary
                setVideoInfo(response.data); // Set video information
            } catch (error) {
                console.error('Failed to fetch video details: ', error);
            }
        };

        fetchVideoInfo();
    }, [videoNum]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/api/videos/videosDelete/${videoNum}`); // Adjust path if necessary
            setDeleteSuccess(true);
            setTimeout(() => {
                navigate('/list'); // Navigate to videoAll.js after deletion
            }, 2000); // 2 seconds delay before navigation
        } catch (error) {
            console.error('Failed to delete video: ', error);
        } finally {
            setDeleting(false);
        }
    };

    if (!videoInfo) return <p>Loading...</p>;

    return (
        <div>
            <h2>Deleting video: {videoInfo.videoTitle}</h2>
            <p>Video Description: {videoInfo.videoDescrip}</p>
            <p>File Name: {videoInfo.fileName}</p>
            <p>Upload Date: {new Date(videoInfo.uploadDate).toLocaleDateString()}</p>
            <p>Likes: {videoInfo.likes}</p>
            {deleting ? (
                <p>Deleting...</p>
            ) : (
                <button onClick={handleDelete} disabled={deleting}>
                    Delete Video
                </button>
            )}
            {deleteSuccess && <p>Video successfully deleted!</p>}
        </div>
    );
};

export default VideoDel;
