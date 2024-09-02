import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminInfo = () => {
	const navigate = useNavigate();
	const [memberInfo, setMemberInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editing, setEditing] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [newEmail, setNewEmail] = useState('');

	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co\.kr)$/;
	const alertShown = useRef(false);

	useEffect(() => {
		const userId = sessionStorage.getItem('userId');
		if (!userId && !alertShown.current) {
			alertShown.current = true;
			alert('로그인 후 이용 바랍니다.');
			navigate('/login');
		} else {
			fetchUserInfo();
		}
	}, [navigate]);

	const fetchUserInfo = async () => {
		try {
			const response = await axios.get(`/userInfo`);
			setMemberInfo(response.data);
			setNewEmail(response.data.userEmail || '');
		} catch (error) {
			setError('회원 정보를 가져오는 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const handleEditToggle = () => {
		setEditing(!editing);
		if (!editing) {
			setNewEmail(memberInfo?.userEmail || '');
			setNewPassword(memberInfo?.userPw || '');
		} else {
			// 편집 모드를 취소할 때 원래 값으로 복원
			setNewEmail(memberInfo?.userEmail || '');
			setNewPassword(memberInfo?.userPw || '');
		}
	};

	const handlePasswordChange = (e) => {
		setNewPassword(e.target.value);
	};

	const handleEmailChange = (e) => {
		setNewEmail(e.target.value);
	};

	const handleUpdate = async () => {
		if (!memberInfo) return;

		if (!emailPattern.test(newEmail)) {
			alert('※ 정확한 이메일 주소를 입력하세요.');
			return;
		}

		try {
			const updateData = {
				userEmail: newEmail,
				...(newPassword && { userPw: newPassword })
			};
			await axios.put(`/update/${memberInfo.userId}`, updateData);
			alert('관리자 정보가 업데이트되었습니다.');
			const response = await axios.get(`/userInfo`);
			setMemberInfo(response.data);
			setEditing(false);
			setNewPassword('');
		} catch (error) {
			console.error('관리자 정보 업데이트에 실패했습니다:', error);
			alert('관리자 정보 업데이트에 실패했습니다.');
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;
	if (!memberInfo) return <div>회원 정보를 불러올 수 없습니다.</div>;

	const spanStyle = {
		marginLeft: '10px',
		flex: 1
	};
	const strongStyle = {
		marginLeft: '20px',
		width: '100px'
	};
	const pStyle = {
		display: 'flex',
		alignItems: 'center'
	};

	const inputStyle = {
		marginLeft: '10px',
		border: 'none',
		borderBottom: '1px solid #ccc',
		outline: 'none',
		width: '50%',  // 원하는 너비로 조정 가능

	};

	return (
		<div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<div className="userInfo" style={{
				width: '80%', maxWidth: '400px', padding: '20px',
				border: '1px solid #ccc', borderRadius: '5px',
				boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff'
			}}>
				<h1 style={{ textAlign: 'center', marginBottom: '40px' }}>관리자 정보</h1>
				<p style={pStyle}>
					<strong style={strongStyle}>관리자ID: </strong>
					<span style={spanStyle}>{memberInfo.userId}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>비밀번호: </strong>
					{editing ? (
						<input
							type="text"
							value={newPassword}
							maxLength={20}
							onChange={handlePasswordChange}
							style={inputStyle}
						/>
					) : (
						<span style={spanStyle}>{memberInfo.userPw ? '*'.repeat(memberInfo.userPw.length) : ''}</span>
					)}
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>이메일: </strong>
					{editing ? (
						<input
							type="email"
							value={newEmail}
							maxLength={60}
							onChange={handleEmailChange}
							style={inputStyle}
						/>
					) : (
						<span style={spanStyle}>{memberInfo.userEmail}</span>
					)}
				</p>

				<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
					{editing ? (
						<>
							<button onClick={handleUpdate} style={{ marginRight: '10px' }}>업데이트</button>
							<button onClick={handleEditToggle}>취소</button>
						</>
					) : (
						<>
							<button onClick={handleEditToggle} style={{ marginRight: '10px' }}>정보 수정</button>
							<button onClick={() => navigate('/admin')}>관리 목록</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminInfo;