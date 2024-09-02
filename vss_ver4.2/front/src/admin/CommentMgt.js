import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentMgt.css';

const CommentMgt = () => {
    const [allComments, setAllComments] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchAllComments();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    const fetchAllComments = async () => {
        setLoading(true);
        try {
            let allComments = [];
            let page = 0;
            let hasMore = true;

            while (hasMore) {
                const response = await axios.get('/comments/admin/all', {
                    params: { page, size: 100 } // 큰 크기로 페이지를 요청
                });
                
                allComments = [...allComments, ...response.data.content];
                hasMore = response.data.content.length === 100;
                page++;
            }

            setAllComments(allComments);
        } catch (error) {
            console.error('댓글을 가져오는 데 실패했습니다.', error);
            setAllComments([]);
        }
        setLoading(false);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSizeChange = (event) => {
        setSize(Number(event.target.value));
        setPage(0);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleDelete = async (commentNum) => {
        const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(`/comments/delete/${commentNum}`);
            fetchAllComments();
        } catch (error) {
            console.error('댓글을 삭제하는 중 오류가 발생했습니다.', error);
        }
    };

    const filterComments = (comment) => {
        return searchTerm === '' || comment.commentContent.includes(searchTerm);
    };

    const sortComments = (commentsToSort) => {
        return [...commentsToSort].sort((a, b) => {
            const dateA = new Date(a.commentDate);
            const dateB = new Date(b.commentDate);
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });
    };

    const sortedAndFilteredComments = sortComments(allComments.filter(filterComments));
    const totalPages = Math.ceil(sortedAndFilteredComments.length / size);
    const paginatedComments = sortedAndFilteredComments.slice(page * size, (page + 1) * size);

    return (
        <div className="comment-container">
            <h1>댓글 관리</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="select-menu">
                    <select value={size} onChange={handleSizeChange}>
                        <option value={5}>5개씩 보기</option>
                        <option value={10}>10개씩 보기</option>
                        <option value={20}>20개씩 보기</option>
                    </select>
                </div>
                <div className="select-menu">
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="newest">최신순</option>
                        <option value="oldest">오래된순</option>
                    </select>
                </div>
            </div>
            {loading ? (
                <p className="loading-message">로딩 중...</p>
            ) : (
                <div>
                    {paginatedComments.length === 0 ? (
                        <p className="no-comments">댓글이 없습니다.</p>
                    ) : (
                        <ul className="comment-list">
                            {paginatedComments.map((comment) => (
                                <li key={comment.commentNum}>
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.userId.userName} ({comment.userId.userId})</span>
                                        <span className="comment-date">{new Date(comment.commentDate).toLocaleString()}</span>
                                        {comment.commentUpdateDate && (
                                            <span className="comment-date"> (수정됨: {new Date(comment.commentUpdateDate).toLocaleString()})</span>
                                        )}
                                    </div>
                                    <p className="comment-content">{comment.commentContent}</p>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(comment.commentNum)}
                                    >
                                        삭제
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="pagination">
                        {[...Array(totalPages).keys()].map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                disabled={number === page}
                            >
                                {number + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentMgt;