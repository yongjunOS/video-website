import React, { useState, useEffect } from 'react';
import './PlaylistCreationForm.css';

const MAX_TITLE_LENGTH = 50; // 제목 최대 글자 수 설정
const MAX_DESCRIPTION_LENGTH = 100; // 설명 최대 글자 수 설정

function PlaylistCreationForm({ onClose, onPlaylistSaved, existingPlaylist }) {
	const [playlistTitle, setPlaylistTitle] = useState('');
	const [playlistDescription, setPlaylistDescription] = useState('');
	const [titleLength, setTitleLength] = useState(0);
	const [descriptionLength, setDescriptionLength] = useState(0);
	const userId = "exampleUserId";
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (existingPlaylist) {
			setPlaylistTitle(existingPlaylist.playlistTitle);
			setPlaylistDescription(existingPlaylist.playlistDescription);
			setTitleLength(existingPlaylist.playlistTitle.length);
			setDescriptionLength(existingPlaylist.playlistDescription.length);
		} else {
			setPlaylistTitle('');
			setPlaylistDescription('');
			setTitleLength(0);
			setDescriptionLength(0);
		}
	}, [existingPlaylist]);

	const handleTitleChange = (e) => {
		const inputText = e.target.value;
		if (inputText.length <= MAX_TITLE_LENGTH) {
			setPlaylistTitle(inputText);
			setTitleLength(inputText.length);
		}
	};

	const handleDescriptionChange = (e) => {
		const inputText = e.target.value;
		if (inputText.length <= MAX_DESCRIPTION_LENGTH) {
			setPlaylistDescription(inputText);
			setDescriptionLength(inputText.length);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const playlistData = {
				playlistTitle,
				playlistDescription,
				userId,
			};
			await onPlaylistSaved(playlistData);
			onClose();
		} catch (error) {
			console.error('Failed to save playlist:', error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<span className="close" onClick={onClose}>&times;</span>
				<h2>{existingPlaylist ? '' : ''}</h2>
				<form onSubmit={handleSubmit} className="playlist-form">
					<div className="form-group">
						<label htmlFor="playlistTitle">제목</label>
						<input
							type="text"
							id="playlistTitle"
							value={playlistTitle}
							onChange={handleTitleChange}
							required
							maxLength={MAX_TITLE_LENGTH}
						/>
						<div className="character-count">
							{titleLength}/{MAX_TITLE_LENGTH}
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="playlistDescription">설명</label>
						<textarea
							id="playlistDescription"
							value={playlistDescription}
							onChange={handleDescriptionChange}
							required
							maxLength={MAX_DESCRIPTION_LENGTH}
							style={{ height: '100px', resize: 'none' }}
						/>
						<div className="character-count">
							{descriptionLength}/{MAX_DESCRIPTION_LENGTH}
						</div>
					</div>
					<button type="submit" className="playlist-submit-button" disabled={submitting}>
						{submitting ? 'Submitting...' : (existingPlaylist ? '수정' : '만들기')}
					</button>
				</form>
			</div>
		</div>
	);
}

export default PlaylistCreationForm;