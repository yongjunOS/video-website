import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdateInfo = () => {
	const [memberInfo, setMemberInfo] = useState({
		userId: '',
		userPw: '',
		userName: '',
		userBdate: '',
		userAge: '',
		userEmail: '',
		userPhone: ''
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [setIsLoggedIn] = useState(false);

	useEffect(() => {
		const userId = sessionStorage.getItem('userId');
		if (!userId) {
			alert('로그인 후 이용 바랍니다.');
			navigate('/login');
		} else {
			fetchUserInfo();
		}
	}, [navigate]);

	const fetchUserInfo = async () => {
		try {
			const response = await axios.get(`/userInfo`); // API 엔드포인트
			setMemberInfo(response.data);
		} catch (error) {
			setError('회원 정보를 가져오는 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "userPhone") {
			const formattedValue = formatPhoneNumber(value);
			setMemberInfo({
				...memberInfo,
				[name]: formattedValue
			});
		} else {
			setMemberInfo({
				...memberInfo,
				[name]: value
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// 이메일 유효성 검사
		const emailPattern = /.+@.+\.(com|co\.kr)$/;
		if (!emailPattern.test(memberInfo.userEmail)) {
			alert("이메일은 .com 또는 .co.kr로 끝나야 합니다.");
			return;
		}

		try {
			await axios.put(`/update/${memberInfo.userId}`, memberInfo);
			navigate('/userInfo'); // 업데이트 후 회원 정보 페이지로 이동
		} catch (error) {
			setError('회원 정보를 업데이트하는 중 오류가 발생했습니다.');
		}
	};

	const formatPhoneNumber = (value) => {
		const cleanValue = value.replace(/\D/g, ''); // 숫자가 아닌 문자 제거
		const match = cleanValue.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
		if (match) {
			return [match[1], match[2], match[3]].filter(Boolean).join('-');
		}
		return value;
	};

	const handleLogout = async () => {
		try {
			// 세션 종료 API 호출 (실제로는 해당 API의 엔드포인트와 메서드를 정의해야 합니다)
			await axios.post(`/logout`);
			console.log('로그아웃 버튼 클릭');
			alert('로그아웃 되었습니다.');
			navigate('/login'); // 로그아웃 성공 시 리다이렉트
		} catch (error) {
			console.error('로그아웃 중 오류가 발생했습니다:', error);
			alert('로그아웃 중 오류가 발생했습니다.');
		}
	};

	const handleDelete = async () => {
		const confirmDelete = window.confirm('정말로 회원 탈퇴하시겠습니까?');
		if (confirmDelete) {
			try {
				await axios.delete(`/delete/${memberInfo.userId}`);
				alert('회원 탈퇴가 완료되었습니다.');
				sessionStorage.removeItem('userId');
				navigate('/list'); // 탈퇴 후 로그인 페이지로 이동
				setIsLoggedIn(false);
			} catch (error) {
				setError('회원 탈퇴 중 오류가 발생했습니다.');
			}
		}
	};

	// 비밀번호 문자 표시
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	const inputStyle = {
		marginLeft: '10px',
		flex: 1
	};

	return (
		<div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>

			<div style={{ position: 'absolute', top: '20px', right: '20px' }}>
				{/* 로그인 상태 메인 페이지로 이동하는 링크 */}
				<Link to="/list" style={{ textDecoration: "none", marginRight: '5px' }}>메인 페이지</Link>|
				{/* 로그 아웃 */}
				<Link to="/login" style={{ textDecoration: "none", marginLeft: '5px' }} onClick={handleLogout}>로그 아웃</Link>
			</div>

			<div className="userInfo" style={{
				width: '80%', maxWidth: '500px', padding: '20px',
				border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff'
			}}>

				<h1 style={{ textAlign: 'center', marginBottom: '40px' }}>정보 수정</h1>
				<form onSubmit={handleSubmit} style={{ width: '90%', maxWidth: '400px' }}>
					<div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
						<label style={{ width: '100px' }}>비밀번호</label>
						<div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
							<input
								type={showPassword ? "text" : "password"}
								name="userPw"
								value={memberInfo.userPw}
								onChange={handleChange}
								style={inputStyle}
							/>
							<span
								onClick={togglePasswordVisibility}
								style={{
									marginLeft: '10px',
									cursor: 'pointer'
								}}
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
					</div>
					<div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
						<label style={{ width: '100px' }}>이름</label>
						<input
							type="text"
							name="userName"
							value={memberInfo.userName}
							onChange={handleChange}
							style={inputStyle}
						/>
					</div>
					<div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
						<label style={{ width: '100px' }}>이메일</label>
						<input
							type="email"
							name="userEmail"
							value={memberInfo.userEmail}
							onChange={handleChange}
							style={inputStyle}
						/>
					</div>
					<div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
						<label style={{ width: '100px' }}>전화번호</label>
						<input
							type="tel"
							name="userPhone"
							maxLength={13}
							value={memberInfo.userPhone}
							onChange={handleChange}
							style={inputStyle}
						/>
					</div>

					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<button type="submit" style={{ width: '70%', marginRight: '10px', marginLeft: '60px' }}>수정</button>
						<button type="button" style={{ width: '70%', marginRight: '10px' }} onClick={() => navigate('/userInfo')}>취소</button>
						<button type="button" style={{ width: '70%' }} onClick={handleDelete}>회원 탈퇴</button>
					</div>

				</form>
			</div>

		</div>
	);
};

export default UpdateInfo;