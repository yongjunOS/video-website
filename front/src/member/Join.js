import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Join = () => {
	const [memberInfo, setMemberInfo] = useState({
		userId: '',
		userPw: '',
		userName: '',
		userBdate: '',
		userAge: '',
		userEmail: '',
		userPhone: '',
		verificationCode: ''
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [userIdError, setUserIdError] = useState('');
	const [userIdAvailable, setUserIdAvailable] = useState(true);
	const [verificationSent, setVerificationSent] = useState(false);
	const [verificationError, setVerificationError] = useState('');
	const [userEmailError, setUserEmailError] = useState('');
	const [userBdateError, setUserBdateError] = useState('');
	const [userNameError, setUserNameError] = useState('');
	const [countdown, setCountdown] = useState(0);
	const [isVerified, setIsVerified] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		let timer;
		if (countdown > 0 && !isVerified) {
			timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		} else if (countdown === 0 && verificationSent && !isVerified) {
			setVerificationSent(false);
			setVerificationError('※ 인증 시간이 만료되었습니다. 다시 요청해주세요.');
		}
		return () => clearTimeout(timer);
	}, [countdown, verificationSent, isVerified]);

	const calculateAge = (birthday) => {
		const today = new Date();
		const birthDate = new Date(birthday);
		let age = today.getFullYear() - birthDate.getFullYear();
		const month = today.getMonth() - birthDate.getMonth();
		if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age.toString();
	};

	const isValidDate = (year, month, day) => {
		const date = new Date(year, month - 1, day);
		return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
	};

	const handleChange = async (e) => {
		const { name, value } = e.target;

		const userIdPattern = /^[a-z0-9_-]{4,20}$/;
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co\.kr)$/;
		const namePattern = /^[가-힣a-zA-Z]+$/;

		if (name === 'userId') {
			if (!userIdPattern.test(value)) {
				setUserIdError('※ 4~20자의 영문 소문자, 숫자와 특수 기호(_), (-)만 사용 가능합니다.');
				setUserIdAvailable(false);
			} else {
				try {
					const response = await axios.post('/checkUserId', { userId: value });
					if (response.data) {
						setUserIdError('');
						setUserIdAvailable(true);
					} else {
						setUserIdError('※ 이미 존재하는 아이디입니다. 다른 아이디를 입력해 주세요.');
						setUserIdAvailable(false);
					}
				} catch (error) {
					console.error('아이디 가용성을 확인하는 중에 오류가 발생했습니다: ', error);
					setUserIdError('');
					setUserIdAvailable(false);
				}
			}
		}

		if (name === 'userName') {
			if (!namePattern.test(value)) {
				setUserNameError('※ 이름은 한글 또는 영문자만 입력 가능합니다.');
			} else {
				setUserNameError('');
			}
			setMemberInfo({
				...memberInfo,
				[name]: value
			});

		} else if (name === 'userBdate') {
			const dateValue = value.replace(/\D/g, '');
			if (dateValue.length <= 8) {
				let formattedDate = dateValue;
				let isValid = true;

				// 년도 제한 (1900-2200)
				if (dateValue.length >= 4) {
					const year = parseInt(dateValue.substr(0, 4));
					if (year < 1900 || year > 2200) {
						isValid = false;
					}
				}

				// 월 제한 (01-12)
				if (dateValue.length >= 6) {
					const month = parseInt(dateValue.substr(4, 2));
					if (month < 1 || month > 12) {
						isValid = false;
					}
				}

				// 일 제한 및 유효성 검사
				if (dateValue.length === 8) {
					const year = parseInt(dateValue.substr(0, 4));
					const month = parseInt(dateValue.substr(4, 2));
					const day = parseInt(dateValue.substr(6, 2));
					if (!isValidDate(year, month, day)) {
						isValid = false;
					}
				}

				formattedDate = dateValue.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

				if (!isValid) {
					setUserBdateError('※ 입력 가능한 날짜 범위가 아닙니다. 정확한 날짜 형식을 입력해 주세요.');
				} else {
					setUserBdateError('');
				}

				setMemberInfo({
					...memberInfo,
					[name]: formattedDate
				});

				if (dateValue.length === 8 && isValid) {
					const age = calculateAge(formattedDate);
					setMemberInfo(prev => ({
						...prev,
						userAge: age
					}));
				}
			}
		} else if (name === 'userAge') {
			const ageValue = value.replace(/[^0-9]/g, '');
			setMemberInfo({
				...memberInfo,
				[name]: ageValue
			});
		} else if (name === 'userEmail') {
			if (!emailPattern.test(value)) {
				setUserEmailError('※ 올바른 이메일 형식이 아닙니다.');
			} else {
				setUserEmailError('');
			}
			setMemberInfo({
				...memberInfo,
				[name]: value
			});
		} else {
			setMemberInfo({
				...memberInfo,
				[name]: value
			});
		}
	};

	const requestVerificationCode = async () => {
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co\.kr)$/;
		if (!emailPattern.test(memberInfo.userEmail)) {
			setUserEmailError('※ 올바른 이메일 형식이 아닙니다.');
			return;
		}

		try {
			const response = await axios.post('/requestVerificationCode', { userEmail: memberInfo.userEmail });
			if (response.data.success) {
				setVerificationSent(true);
				setVerificationError('');
				setCountdown(120); // 2분 = 120초
				setIsVerified(false); // 새로운 인증번호 요청 시 검증 상태 초기화
				alert('인증번호를 이메일로 전송했습니다.');
			} else {
				setVerificationSent(false);
				setVerificationError('※ 인증번호 요청에 실패했습니다. 다시 시도해 주세요.');
			}
		} catch (error) {
			console.error('인증번호 요청 중 오류가 발생했습니다: ', error);
			setVerificationSent(false);
			setVerificationError('※ 서버 오류가 발생했습니다.');
		}
	};

	const verifyCode = async () => {
		try {
			const response = await axios.post('/verifyCode', {
				userEmail: memberInfo.userEmail,
				verificationCode: memberInfo.verificationCode
			});
			if (response.data.success) {
				setIsVerified(true);
				setVerificationError(''); // 확인 시 오류 메시지 지우기
				alert('인증이 완료되었습니다.');

			} else {
				setIsVerified(false);
				setVerificationError('※ 올바르지 않은 인증번호입니다.');
			}
		} catch (error) {
			console.error('인증번호 확인 중 오류가 발생했습니다: ', error);
			setIsVerified(false);
			setVerificationError('※ 이메일을 확인하고 올바른 인증번호를 입력하세요.');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co\.kr)$/;
		if (!emailPattern.test(memberInfo.userEmail)) {
			alert("이메일 형식이 올바르지 않습니다.");
			return;
		}

		if (!isVerified) {
			alert('이메일 인증이 필요합니다.');
			return;
		}

		try {
			const response = await axios.post('/insert', memberInfo);

			if (response.status === 201) {
				setSuccess(true);
				setError('');
				alert('회원 가입에 성공했습니다!');
				navigate('/login');
			} else {
				setSuccess(false);
				alert('회원 가입에 실패했습니다.');
			}
		} catch (error) {
			setSuccess(false);
			alert('서버 오류가 발생했습니다.');
			console.error('가입 중 오류가 발생했습니다: ', error);
		}
	};

	const formatPhoneNumber = (value) => {
		const cleanValue = value.replace(/\D/g, '');
		const match = cleanValue.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
		if (match) {
			return [match[1], match[2], match[3]].filter(Boolean).join('-');
		}
		return value;
	};

	const handlePhoneChange = (e) => {
		const input = e.target.value;
		const formatted = formatPhoneNumber(input);
		setMemberInfo({
			...memberInfo,
			userPhone: formatted
		});
	};

	const handleGoBack = () => {
		navigate(-1);
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
			<h1 style={{ marginBottom: '20px' }}>회원 가입</h1>
			{success && <p style={{ color: 'green' }}>회원 가입에 성공했습니다!</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="아이디"
					name="userId"
					minLength={4}
					maxLength={20}
					value={memberInfo.userId}
					onChange={handleChange}
					required
					style={inputStyle}
				/>
				<br />
				{!userIdAvailable && <p style={{ color: 'red', fontSize: '10.5px' }}>{userIdError}</p>}
				<input
					type="password"
					placeholder="비밀번호"
					name="userPw"
					maxLength={30}
					value={memberInfo.userPw}
					onChange={handleChange}
					required
					style={inputStyle}
				/>
				<br />
				<input
					type="text"
					placeholder="이름"
					name="userName"
					maxLength={20}
					value={memberInfo.userName}
					onChange={handleChange}
					required
					style={inputStyle}
				/>
				<br />
				{userNameError && <p style={{ color: 'red', fontSize: '10.5px' }}>{userNameError}</p>}
				<input
					type="text"
					placeholder="생년월일 (YYYY-MM-DD)"
					name="userBdate"
					maxLength={10}
					value={memberInfo.userBdate}
					onChange={handleChange}
					required
					style={inputStyle}
				/>
				<br />
				{userBdateError && <p style={{ color: 'red', fontSize: '10.5px' }}>{userBdateError}</p>}
				<input
					type="text"
					placeholder="나이"
					name="userAge"
					maxLength={3}
					value={memberInfo.userAge}
					onChange={handleChange}
					required
					style={inputStyle}
				/>
				<br />
				<input
					type="tel"
					placeholder="전화번호"
					maxLength={13}
					name="userPhone"
					value={memberInfo.userPhone}
					onChange={handlePhoneChange}
					required
					style={inputStyle}
				/>
				<br />
				<input
					type="email"
					placeholder="이메일"
					maxLength={60}
					name="userEmail"
					value={memberInfo.userEmail}
					onChange={handleChange}
					required
					style={inputStyle}
				/>
				<br />
				{userEmailError && <p style={{ color: 'red', fontSize: '10.5px' }}>{userEmailError}</p>}
				{!isVerified ? (
					<>
						<button
							type="button"
							onClick={requestVerificationCode}
							style={{ ...inputStyle, width: '330px' }}
							disabled={(verificationSent && countdown > 0) || !memberInfo.userEmail}
						>
							{verificationSent && countdown > 0 ? `인증번호 재요청 (${countdown}초)` : '인증번호 요청'}
						</button>
						<br />
						{verificationSent && (
							<div>
								<input
									type="text"
									placeholder="인증번호를 입력하세요."
									name="verificationCode"
									maxLength={6}
									value={memberInfo.verificationCode}
									onChange={handleChange}
									required
									style={{ padding: '10px', marginBottom: '10px', width: '230px', marginTop: '-20px' }}
								/>
								<button
									type="button"
									onClick={verifyCode}
									style={{ padding: '10px', marginBottom: '10px', width: '90px', marginLeft: '10px' }}
								>
									확인
								</button>
								<br />
							</div>
						)}
						{verificationError && !isVerified && <p style={{ color: 'red', fontSize: '10.5px' }}>{verificationError}</p>}
					</>
				) : (
					<div style={{ ...inputStyle, width: '330px', textAlign: 'center', backgroundColor: '#e6f7ff', color: '#1890ff' }}>
						이메일 인증 완료
					</div>
				)}

				<button type="submit" style={{ ...inputStyle, width: '160px', marginRight: '10px' }}>가입하기</button>
				<button type="button" onClick={handleGoBack} style={{ ...inputStyle, width: '160px' }}>취소</button>
			</form>
		</div>
	);
};

export default Join;