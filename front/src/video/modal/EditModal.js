import React, { useState } from 'react';
import axios from 'axios';

const EditModal = ({ isOpen, onRequestClose, videoNum, initialDescription, onUpdateSuccess }) => {
    const [newDescription, setNewDescription] = useState(initialDescription);
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await axios.put(`/api/videos/videosUpdate/${videoNum}`, { videoDescrip: newDescription });
            onUpdateSuccess(newDescription); // 부모 컴포넌트의 상태를 업데이트합니다
            setUpdateSuccess(true);
            setTimeout(() => {
                onRequestClose(); // 성공적으로 업데이트 후 모달을 닫습니다
            }, 1000); // 업데이트 후 2초 뒤에 모달을 닫습니다
        } catch (error) {
            console.error('비디오 설명 업데이트 실패: ', error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
            <div className="modal-content">
                <h2>비디오 설명 편집</h2>
                <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2} // 필요에 따라 입력 필드의 높이 조정
                    cols={50} // 필요에 따라 입력 필드의 너비 조정
                />
                <div className="button-group">
                    <button className="edit-button" onClick={onRequestClose}>닫기</button>
                    <button className="edit-button" onClick={handleUpdate} disabled={updating}>
                        {updating ? '업데이트 중...' : '확인 '}
                    </button>
                </div>
                {updateSuccess && <p>비디오 설명이 성공적으로 업데이트되었습니다!</p>}
            </div>
        </div>
    );
};

export default EditModal;
