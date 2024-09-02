import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const SaveModal = ({ isOpen, onRequestClose, playlists, videoId, onSave }) => {
	const [validatedPlaylists, setValidatedPlaylists] = useState([]);
	const [selectedPlaylists, setSelectedPlaylists] = useState([]);

	useEffect(() => {
		setValidatedPlaylists(Array.isArray(playlists) ? playlists : []);
	}, [playlists]);

	const handleSaveClick = () => {
		console.log("handleSaveClick called");
		console.log("selectedPlaylists:", selectedPlaylists);
		if (typeof onSave === 'function') {
			if (selectedPlaylists.length > 0) {
				console.log(`SaveModal - Saving video ${videoId} to playlists:`, selectedPlaylists);
				onSave(selectedPlaylists, videoId);
				onRequestClose();
			} else {
				console.error("SaveModal - No playlists selected");
			}
		} else {
			console.error("SaveModal - onSave is not a function");
		}
	};

	const togglePlaylistSelection = (playlistNum) => {
		if (selectedPlaylists.includes(playlistNum)) {
			setSelectedPlaylists(selectedPlaylists.filter(pl => pl !== playlistNum));
		} else {
			setSelectedPlaylists([...selectedPlaylists, playlistNum]);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="Save Video to Playlist"
			style={{
				content: {
					top: '50%',
					left: '50%',
					right: 'auto',
					bottom: 'auto',
					marginRight: '-50%',
					transform: 'translate(-50%, -50%)',
					width: '400px',
					height: '400px',
					padding: '20px',
					borderRadius: '10px',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
					zIndex: 1000
				},
				overlay: {
					zIndex: 999,
					backgroundColor: 'rgba(0, 0, 0, 0)' // 투명하게 설정
				}
			}}
		>
			<h2>재생목록에 저장</h2>
			{validatedPlaylists.length > 0 ? (
				<ul>
					{validatedPlaylists.map((playlist) => (
						<li key={playlist.playlistNum}>
							<label>
								<input
									type="checkbox"
									onChange={() => togglePlaylistSelection(playlist.playlistNum)}
									checked={selectedPlaylists.includes(playlist.playlistNum)}
								/>
								{playlist.playlistTitle}
							</label>
						</li>
					))}
				</ul>
			) : (
				<p>저장된 재생목록이 없습니다.</p>
			)}
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
				<button onClick={handleSaveClick} style={{ marginRight: '10px' }}>저장</button>
				<button onClick={onRequestClose}>닫기</button>
			</div>
		</Modal>
	);
};

SaveModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	playlists: PropTypes.arrayOf(PropTypes.shape({
		playlistNum: PropTypes.number.isRequired,
		playlistTitle: PropTypes.string.isRequired
	})),
	videoId: PropTypes.number.isRequired,
	onSave: PropTypes.func.isRequired
};

export default SaveModal;
