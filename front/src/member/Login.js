import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
	const [userId, setUserId] = useState('');
	const [userPw, setUserPw] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post('/login', {
				userId,
				userPw
			});

			if (response.status === 200) {
				if (response.data === 'admin') {
					sessionStorage.setItem('userId', userId);
					alert('관리자 페이지로 이동합니다.')
					navigate('/admin'); // admin.js로 이동			
				} else {
					sessionStorage.setItem('userId', userId);
					setUserId(response.data);
					alert(`"${userId}"님 환영합니다.`);
					navigate('/list'); // 로그인 성공 시 리다이렉트		
				}
			}
		} catch (error) {
			alert('아이디 또는 비밀번호가 유효하지 않습니다.');
			console.error('로그인 실패: ', error);
		}
	};
	
	const inputStyle = {
		padding: '10px',
		marginBottom: '10px',
		width: '330px',
		border: '1px solid #ccc',
		borderRadius: '5px'
	};

	return (

		<div style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '20px', width: 'auto', textAlign: 'center' }}>
			<h1 style={{ marginBottom: '20px' }}>로그인</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<input
						type="text"
						placeholder="아이디"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
						required
						style={inputStyle}
					/>
				</div>
				<div>
					<input
						type="password"
						placeholder="비밀번호"
						value={userPw}
						onChange={(e) => setUserPw(e.target.value)}
						required
						style={inputStyle}
					/>
				</div>

				<button type="submit" style={{ padding: '10px', width: '330px', marginBottom: '10px' }}>로그인</button>

				<div className="additional-links" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
					<Link to="/join" style={{ textDecoration: 'none' }}>회원 가입</Link>|
					<Link to="/findId" style={{ textDecoration: 'none' }}>아이디 찾기</Link>|
					<Link to="/findPw" style={{ textDecoration: 'none' }}>비밀번호 찾기</Link>
				</div>

			</form>
		</div>
	);
};

export default Login;