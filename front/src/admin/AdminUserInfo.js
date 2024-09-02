import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const AdminUserInfo = () => {
	const navigate = useNavigate();
	const { userId } = useParams();
	const [userData, setUserData] = useState(null);
	const [editing, setEditing] = useState(false); // 편집 모드 상태 관리
	const [newGrade, setNewGrade] = useState(''); // 새로운 등급 상태 관리
	const alertShown = useRef(false);

	useEffect(() => {
		// userId를 기반으로 사용자 데이터를 가져오는 비동기 함수
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`/select/${userId}`);
				setUserData(response.data);
				setNewGrade(response.data.userGrade); // 현재 등급으로 초기화
			} catch (error) {
				console.error('사용자 데이터를 가져오는 중 에러 발생:', error);
				alert('사용자 데이터를 가져오는데 실패했습니다.');
			}
		};

		fetchUserData();
	}, [userId]);

	// handleDelete 함수
	const handleDelete = async () => {
		const confirmDelete = window.confirm("정말로 회원을 삭제하시겠습니까?");

		if (confirmDelete) {
			try {
				await axios.delete(`/delete/${userId}`);
				alert('회원을 삭제했습니다.');
				navigate('/userMgt'); // 회원 삭제 후 전체 목록 페이지로 이동
			} catch (error) {
				console.error('회원 삭제 중 에러 발생:', error);
				alert('회원 삭제에 실패했습니다.');
			}
		}
	};

	// 로그아웃 처리 함수
	const handleLogout = () => {
		console.log('로그아웃 버튼 클릭');
		alert('로그아웃 되었습니다.');
		navigate('/login'); // 로그아웃 성공 시 리다이렉트
	};

	// 편집 모드 토글 함수
	const handleEditToggle = () => {
		setEditing(!editing); // 편집 모드 상태를 반전시킴
	};

	// 등급 변경 입력 처리 함수
	const handleGradeChange = (e) => {
		setNewGrade(e.target.value); // 새로운 등급 상태를 입력 값으로 설정
	};

	// 등급 업데이트 함수
	const handleGradeUpdate = async () => {
		try {
			await axios.put(`/updateGrade/${userId}`, { userGrade: newGrade }); // 서버로 새로운 등급 업데이트 요청
			alert('회원 등급을 업데이트했습니다.');
			// 업데이트 후 사용자 데이터 다시 가져오기
			const response = await axios.get(`/select/${userId}`);
			setUserData(response.data); // 업데이트된 사용자 데이터 설정
			setEditing(false); // 편집 모드 종료
		} catch (error) {
			console.error('회원 등급 업데이트에 실패했습니다:', error);
			alert('회원 등급 업데이트에 실패했습니다.');
		}
	};

	if (!userData) {
		return <div>로딩 중...</div>; // 데이터를 가져오는 동안 로딩 표시
	}

	const handleGoBack = () => {
		navigate(-1); //
	}

	// 스타일 객체들
	const spanStyle = {
		marginLeft: '10px',
		flex: 1,
	};
	const strongStyle = {
		marginLeft: '10px',
		width: '100px',
	};
	const pStyle = {
		display: 'flex',
		alignItems: 'center',
	};

	return (
		<div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
			<div style={{ position: 'absolute', top: '20px', right: '20px' }}>
				<Link to="/userMgt" style={{ textDecoration: "none", marginRight: '5px' }}>전체 목록</Link>|
				<Link to="/login" style={{ textDecoration: "none", marginLeft: '5px' }} onClick={handleLogout}>로그 아웃</Link>
			</div>
			<div className="adminUserInfo" style={{
				width: '80%', maxWidth: '400px', padding: '20px',
				border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff'
			}}>
				<h1 style={{ textAlign: 'center', marginBottom: '10px' }}>회원 상세 정보</h1>

				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
					<button style={{ width: '120px', marginRight: '5px' }} onClick={handleGoBack}>전체 목록</button>
					<button style={{ width: '120px' }} onClick={handleDelete}>회원 삭제</button>
				</div>

				<div>
					<p style={pStyle}>
						<strong style={strongStyle}>회원 아이디:</strong>
						<span style={spanStyle}>{userData.userId}</span>
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>회원 이름:</strong>
						<span style={spanStyle}>{userData.userName}</span>
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>가입 날짜:</strong>
						<span style={spanStyle}>{userData.userRegdate}</span>
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>등급:</strong>
						{editing ? (
							<select value={newGrade} onChange={handleGradeChange}>
								<option value="Bronze">Bronze</option>
								<option value="Silver">Silver</option>
								<option value="Gold">Gold</option>
								<option value="Diamond">Diamond</option>
							</select>
						) : (
							<span style={spanStyle}>{userData.userGrade}</span>
						)}
						{/* 편집 모드일 때 업데이트 버튼 보여줌 */}
						{editing && (
							<button style={{ marginLeft: '40px' }}
								onClick={handleGradeUpdate}>업데이트</button>
						)}
						{/* 편집 모드 전환 버튼 */}
						{!editing && (
							<button style={{ marginRight: '40px' }}
								onClick={handleEditToggle}>등급 수정</button>
						)}
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>나이:</strong>
						<span style={spanStyle}>{userData.userAge}</span>
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>이메일:</strong>
						<span style={spanStyle}>{userData.userEmail}</span>
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>전화번호:</strong>
						<span style={spanStyle}>{userData.userPhone}</span>
					</p>
					<p style={pStyle}>
						<strong style={strongStyle}>생년월일:</strong>
						<span style={spanStyle}>{userData.userBdate}</span>
					</p>

				</div>
			</div>
		</div>
	);
};

export default AdminUserInfo;
