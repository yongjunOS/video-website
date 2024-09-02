import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaylistCreationForm from './PlaylistCreationForm';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import './PlaylistList.css';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

function PlaylistList() {
	const [playlists, setPlaylists] = useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState(null);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingPlaylist, setEditingPlaylist] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hoveredItem, setHoveredItem] = useState(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const navigate = useNavigate(); // useNavigate 훅 사용

	useEffect(() => {
		fetchPlaylists();
	}, []);

	const fetchPlaylists = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get('/playlists/selectAll');
			const sortedPlaylists = Array.isArray(response.data)
				? response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
				: [];
			setPlaylists(sortedPlaylists);
			setError(null);
		} catch (error) {
			console.error('Failed to fetch playlists:', error);
			setError('Failed to load playlists. Please try again later.');
			setPlaylists([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await axios.post('/logout');
			setPlaylists([]); // 재생목록 데이터 초기화
			navigate('/login'); // 로그인 페이지로 이동
		} catch (error) {
			console.error('로그아웃 중 오류 발생:', error);
		}
	};

	const handleClickPlaylist = async (playlistNum) => {
		try {
			const response = await axios.get(`/playlists/${playlistNum}`);
			setSelectedPlaylist(response.data);
		} catch (error) {
			console.error('Failed to fetch playlist details:', error);
			setError('Failed to load playlist details. Please try again.');
		}
	};

	const handleCreatePlaylist = () => {
		if (sessionStorage.getItem('userId')) {
			setShowCreateForm(true);
			setEditingPlaylist(null);
		} else {
			alert('로그인을 해주세요.');
		}
	};

	const handleCloseCreateForm = () => {
		setShowCreateForm(false);
	};

	const handlePlaylistSaved = async (playlistData) => {
		try {
			if (editingPlaylist) {
				await axios.put(`/playlists/${editingPlaylist.playlistNum}`, playlistData);
			} else {
				await axios.post('/playlists', playlistData);
			}
			fetchPlaylists();
			setShowCreateForm(false);
		} catch (error) {
			console.error('Failed to save playlist:', error);
			setError('Failed to save playlist. Please try again.');
			if (error.response) {
				console.error('Response data:', error.response.data);
				console.error('Response status:', error.response.status);
				console.error('Response headers:', error.response.headers);
			}
		}
	};

	const handleEditPlaylist = (playlist) => {
		setEditingPlaylist(playlist);
		setShowCreateForm(true);
	};

	const handleDeletePlaylist = async (playlistNum) => {
		try {
			await axios.delete(`/playlists/${playlistNum}`);
			fetchPlaylists();
			setSelectedPlaylist(null);
		} catch (error) {
			console.error('Failed to delete playlist:', error);
			setError('Failed to delete playlist. Please try again.');
		}
	};

	const handleDeleteVideo = async (playlistNum, videoNum) => {
		try {
			await axios.delete(`/playlists/${playlistNum}/videos/${videoNum}`);
			const updatedPlaylist = { ...selectedPlaylist };
			updatedPlaylist.videos = updatedPlaylist.videos.filter(video => video.videoNum !== videoNum);
			setSelectedPlaylist(updatedPlaylist);
		} catch (error) {
			console.error('Failed to delete video from playlist:', error);
			setError('Failed to delete video. Please try again.');
		}
	};

	const handleMouseEnter = (index) => {
		setHoveredItem(index);
	};

	const handleMouseLeave = () => {
		setHoveredItem(null);
	};

	const handleMouseMove = (event) => {
		const item = event.currentTarget;
		const rect = item.getBoundingClientRect();
		const x = event.clientX - rect.left - rect.width / 2;
		const y = event.clientY - rect.top - rect.height / 2;

		setMousePosition({ x: x / 20, y: y / 20 });
	};

	const handleViewVideo = (videoNum) => {
		// 예시: 동영상 보기 버튼 클릭 시, 동영상 ID를 기반으로 새로운 경로로 이동
		navigate(`/videosDetail/${videoNum}`);
	};

	const renderPlaylists = () => {
		if (!Array.isArray(playlists) || playlists.length === 0) {
			return <p>재생목록이 없습니다.</p>;
		}

		return (
			<div className="playlist-container">
				{playlists.map((playlist, index) => (
					<div
						key={playlist.playlistNum}
						className={`playlist-item ${hoveredItem === index ? 'hover' : ''}`}
						onMouseEnter={() => handleMouseEnter(index)}
						onMouseLeave={handleMouseLeave}
						onMouseMove={handleMouseMove}
						onClick={() => handleClickPlaylist(playlist.playlistNum)}
						style={{
							'--rotate-x': `${mousePosition.y}deg`,
							'--rotate-y': `${-mousePosition.x}deg`,
							cursor: 'pointer'
						}}
					>
						<h2>{playlist.playlistTitle}</h2>
						<p>{playlist.playlistDescription}</p>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<button
								onClick={(e) => { e.stopPropagation(); handleEditPlaylist(playlist); }}
								style={{ fontSize: '15px', padding: '5px 20px' }}
							>
								수정
							</button>
							<button
								onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.playlistNum); }}
								style={{ fontSize: '15px', padding: '5px 20px' }}
							>
								삭제
							</button>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="app">
			<h1></h1>
			<button className="create-playlist-button" onClick={handleCreatePlaylist}>
				<span className="create-icon">+</span>
				<span className="create-text">재생목록 만들기</span>
			</button>
			{isLoading ? (
				<p>Loading playlists...</p>
			) : error ? (
				<p className="error-message">{error}</p>
			) : (
				renderPlaylists()
			)}
			{showCreateForm && (
				<PlaylistCreationForm
					onClose={handleCloseCreateForm}
					onPlaylistSaved={handlePlaylistSaved}
					existingPlaylist={editingPlaylist}
				/>
			)}
			{selectedPlaylist && (
				<div className="modal">
					<div className="modal-content" style={{ width: '80%', margin: 'auto', maxWidth: '1200px' }}>
						<span className="close" onClick={() => setSelectedPlaylist(null)}>&times;</span>
						<h2>{selectedPlaylist.playlistTitle}</h2>
						<p>{selectedPlaylist.playlistDescription}</p>
						<h3>저장목록</h3>
						<ul>
							{Array.isArray(selectedPlaylist.videos) && selectedPlaylist.videos.map(video => (
								<li key={video.videoNum}>
									<h4>{video.videoTitle}</h4>
									<button onClick={() => handleViewVideo(video.videoNum)}>
										보기
									</button>
									{/* Delete button for each video */}
									<button onClick={() => handleDeleteVideo(selectedPlaylist.playlistNum, video.videoNum)}>
										삭제
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}

export default PlaylistList;