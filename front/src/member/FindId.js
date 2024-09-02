import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FindId = () => {
	const [userEmail, setEmail] = useState('');
	const [userPhone, setPhone] = useState('');

	// 전화번호 입력 처리 함수: 숫자만 입력되도록 설정 및 자동으로 하이픈 추가
	const handlePhoneChange = (e) => {
		const value = e.target.value;
		// 숫자만 포함되도록 정규식을 사용하여 검사
		const formattedPhoneNumber = value
			.replace(/[^0-9]/g, '') // 숫자 이외의 문자 제거
			.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 하이픈 추가
		setPhone(formattedPhoneNumber);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post('/findId', {
				userEmail: userEmail,
				userPhone: userPhone
			});

			if (response.status === 200) {
				// 서버로부터 받은 모든 아이디를 alert 창에 순서대로 표시
				const userIds = response.data.join('", "'); // 배열을 문자열로 변환하여 표시
				alert(`입력하신 정보로 가입된 아이디는 \n"${userIds}"입니다.`);
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				alert('일치하는 회원 정보가 없습니다.\n이메일과 전화번호를 다시 확인해주세요.');
			} else {
				alert('오류가 발생했습니다. 다시 시도해주세요.');
			}
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
			<h1 style={{ marginBottom: '20px'}}>아이디 찾기</h1>
			<form onSubmit={handleSubmit}>
				<div>
					{/* <label htmlFor="email">이메일:</label> */}
					<input
						type="email"
						id="userEmail"
						placeholder="이메일 입력"
						maxLength={60}
						value={userEmail}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={inputStyle}
					/>
				</div>
				<div>
					  <input
                        type="tel"
                        id="userPhone"
                        placeholder="전화번호 입력"
                        value={userPhone}
                        maxLength={13}
                        onChange={handlePhoneChange} // 숫자와 하이픈 자동 입력 처리 함수로 변경
                        required
                        style={inputStyle}
                    />
				</div>
				<button type="submit" style={{ padding: '10px', width: '330px', marginBottom: '10px' }}>찾기</button>

				<div className="additional-links" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
					<Link to="/login" style={{ textDecoration: 'none' }}>로그인</Link>|
					<Link to="/join" style={{ textDecoration: 'none' }}>회원 가입</Link>|
					<Link to="/findPw" style={{ textDecoration: 'none' }}>비밀번호 찾기</Link>
				</div>

			</form>
		</div>
	);
};

export default FindId;