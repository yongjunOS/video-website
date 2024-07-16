import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
	const navigate = useNavigate();
	const [memberInfo, setMemberInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const alertShown = useRef(false); // alert가 표시되었는지 여부를 추적하는 ref

	useEffect(() => {
		const fetchUserInfo = async () => {
			const userId = sessionStorage.getItem('userId');
			if (!userId) {
				setLoading(false);
				return;
			}

			try {
				const response = await axios.get(`/userInfo`);
				setMemberInfo(response.data);
			} catch (error) {
				setError('회원 정보를 가져오는 중 오류가 발생했습니다.');
			} finally {
				setLoading(false);
			}
		};

		fetchUserInfo();
	}, []);

	useEffect(() => {
		const userId = sessionStorage.getItem('userId');
		if (!userId && !alertShown.current) {
			alertShown.current = true;
			alert('로그인 후 이용 바랍니다.');
			navigate('/login');
		}
	}, [navigate]);

	if (loading) return <div>Loading...</div>;

	if (!sessionStorage.getItem('userId')) {
		return null;
	}

	if (error) return <div>{error}</div>;

	const spanStyle = {
		marginLeft: '10px',
		flex: 1
	};
	const strongStyle = {
		marginLeft: '50px',
		width: '100px'
	};
	const pStyle = {
		display: 'flex',
		alignItems: 'center'
	};

	return (
		<div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<div className="userInfo" style={{ width: '80%', maxWidth: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
				<h1 style={{ textAlign: 'center', marginBottom: '40px' }}>회원 정보</h1>
				<p style={pStyle}>
					<strong style={strongStyle}>아이디: </strong>
					<span style={spanStyle}>{memberInfo.userId}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>이름: </strong>
					<span style={spanStyle}>{memberInfo.userName}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>생년월일: </strong>
					<span style={spanStyle}>{memberInfo.userBdate}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>나이: </strong>
					<span style={spanStyle}>{memberInfo.userAge}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>이메일: </strong>
					<span style={spanStyle}>{memberInfo.userEmail}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>전화번호: </strong>
					<span style={spanStyle}>{memberInfo.userPhone}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>가입 날짜: </strong>
					<span style={spanStyle}>{memberInfo.userRegdate}</span>
				</p>
				<p style={pStyle}>
					<strong style={strongStyle}>회원 등급: </strong>
					<span style={spanStyle}>{memberInfo.userGrade}</span>
				</p>
				{/* 추가적인 회원 정보 필드들을 필요에 따라 출력 */}

				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<button type="button" style={{ width: '30%', marginRight: '10px' }} onClick={() => navigate('/updateInfo')}>정보 수정</button>
					<button type="button" style={{ width: '30%' }} onClick={() => navigate('/list')}>취소</button>
				</div>
			</div>
		</div>
	);
};

export default UserInfo;
