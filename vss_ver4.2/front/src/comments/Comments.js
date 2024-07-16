import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comments.css';

const Comments = (props) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [inputLength, setInputLength] = useState(0);
    const [editingCommentNum, setEditingCommentNum] = useState(null);
    const [totalComments, setTotalComments] = useState(0);
    const [userId, setUserId] = useState(null);
    const [videoNum, setVideoNum] = useState(props.videoNum);
    const [showOnlyMyComments, setShowOnlyMyComments] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        const loggedInUserId = sessionStorage.getItem('userId');
        setUserId(loggedInUserId);
        fetchComments();
    }, [props.videoNum]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/comments/selectAll/${props.videoNum}`);
            setComments(response.data);
            setTotalComments(response.data.length);
        } catch (error) {
            console.error('댓글을 불러오는 중 오류가 발생했습니다: ', error);
        }
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setNewComment(value);
        setInputLength(value.length);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (newComment.trim() === '') {
            alert('댓글을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`/comments/insert`, {
                commentContent: newComment.trim(),
                userId: userId,
                videoNum: props.videoNum
            });

            setNewComment('');
            setInputLength(0);
            fetchComments();
        } catch (error) {
            if (error.response && error.response.status === 500) {
                alert('회원정보를 확인해주세요.');
            } else {
                console.error('댓글을 추가하는 중 오류가 발생했습니다: ', error);
            }
        }
    };

    const handleEditInputChange = (event, commentNum) => {
        const { value } = event.target;
        const updatedComments = comments.map(comment => {
            if (comment.commentNum === commentNum) {
                return { ...comment, tempContent: value };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const startEditingComment = (commentNum) => {
        setEditingCommentNum(commentNum);
        const commentToEdit = comments.find(comment => comment.commentNum === commentNum);
        const updatedComments = comments.map(comment => {
            if (comment.commentNum === commentNum) {
                return { ...comment, tempContent: commentToEdit.commentContent };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const handleUpdate = async (commentNum, updatedContent) => {
        if (updatedContent.trim() === '') {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.put(`/comments/update/${commentNum}`, {
                commentContent: updatedContent.trim(),
                userId: userId
            });

            if (response.status === 403) {
                alert('회원 정보를 다시 확인해주세요.');
                return;
            }

            setEditingCommentNum(null);
            fetchComments();
        } catch (error) {
            console.error('댓글을 수정하는 중 오류가 발생했습니다: ', error);
        }
    };

    const handleDelete = async (commentNum) => {
        const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
        if (!confirmed) {
            return;
        }

        try {
            const response = await axios.delete(`/comments/delete/${commentNum}`);

            if (response.status === 403) {
                alert('권한이 없습니다.');
                return;
            }

            fetchComments();
        } catch (error) {
            console.error('댓글을 삭제하는 중 오류가 발생했습니다: ', error);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateTimeString).toLocaleString('ko-KR', options).replace(',', '');
    };

    const handleToggleMyComments = () => {
        setShowOnlyMyComments(!showOnlyMyComments);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const sortComments = (commentsToSort) => {
        return [...commentsToSort].sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.commentDate) - new Date(a.commentDate);
            } else {
                return new Date(a.commentDate) - new Date(b.commentDate);
            }
        });
    };

    let filteredComments = showOnlyMyComments
        ? comments.filter(comment => comment.userId.userId === userId)
        : comments;
    
    filteredComments = sortComments(filteredComments);

    return (
        <div className="comments-container">
            <h2>댓글</h2>
            {userId ? (
                <div className="comment-author">작성자: {userId}</div>
            ) : (
                <div className="comment-author">로그인 해주세요</div>
            )}
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    className="comment-input"
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="댓글을 입력하세요"
                    maxLength={200}
                    required
                />
                <div className="form-footer">
                    <div className="input-length">{inputLength}/200</div>
                    <div className="total-comments">
                        총 댓글 수: {filteredComments.length}
                        {showOnlyMyComments && ` / 전체 ${comments.length}`}
                    </div>
                    <button type="submit">댓글 입력</button>
                </div>
            </form>
            <div className="controls-container">
                <div className="toggle-container">
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showOnlyMyComments}
                            onChange={handleToggleMyComments}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span>내 댓글만 보기</span>
                </div>
                <div className="sort-container">
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="newest">최신순</option>
                        <option value="oldest">오래된순</option>
                    </select>
                </div>
            </div>
            <div className="comments-list">
                {filteredComments.map(comment => (
                    <div key={comment.commentNum} className="comment">
                        <div className="comment-header">
                            <span className="comment-author">작성자: {comment.userId.userName} ({comment.userId.userId})</span>
                            <span className="comment-date">작성일: {formatDateTime(comment.commentDate)}</span>
                            {comment.commentUpdateDate && <span className="comment-date">최종 수정일: {formatDateTime(comment.commentUpdateDate)}</span>}
                            <div className="comment-actions">
                                {userId === comment.userId.userId && editingCommentNum === comment.commentNum ? (
                                    <button onClick={() => handleUpdate(comment.commentNum, comment.tempContent)}>완료</button>
                                ) : userId === comment.userId.userId ? (
                                    <button onClick={() => startEditingComment(comment.commentNum)}>수정</button>
                                ) : null}
                                {(userId === comment.userId.userId || userId === 'admin') && (
                                    <button onClick={() => handleDelete(comment.commentNum)}>삭제</button>
                                )}
                            </div>
                        </div>
                        {editingCommentNum === comment.commentNum ? (
                            <textarea
                                className="comment-edit-input"
                                value={comment.tempContent}
                                onChange={(e) => handleEditInputChange(e, comment.commentNum)}
                                maxLength={200}
                                required
                            />
                        ) : (
                            <div className="comment-content">{comment.commentContent}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;