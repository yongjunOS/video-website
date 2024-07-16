import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({ isOpen, onRequestClose, videoNum }) => {
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/api/videos/videosDelete/${videoNum}`); // Adjust path if necessary
            setDeleteSuccess(true);
            setTimeout(() => {
                onRequestClose(); // Close modal on successful deletion
                navigate('/list'); // Navigate to VideoAll after deletion
            }, 1000); // Close modal after 1 second
        } catch (error) {
            console.error('Failed to delete video: ', error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
            <div className="modal-content">
                <h2>비디오 삭제</h2>
                <p>이 비디오를 삭제하시겠습니까?</p>
                <div className="button-group">
                    <button className="delete-button" onClick={onRequestClose}>취소</button>
                    <button className="delete-button" onClick={handleDelete} disabled={deleting}>
                        {deleting ? '삭제 중...' : '확인'}
                    </button>
                </div>
                {deleteSuccess && <p>비디오가 성공적으로 삭제되었습니다!</p>}
            </div>
        </div>
    );
};

export default DeleteModal;
