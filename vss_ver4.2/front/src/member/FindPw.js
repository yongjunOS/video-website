import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FindPw = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/findPw', {
                userEmail: userEmail,
                userId: userId
            });

            if (response.status === 200) {
                // 서버로부터 받은 메시지를 alert 창에 표시
                alert(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert('일치하는 회원 정보가 없습니다.\n아이디와 이메일을 다시 확인해주세요.');
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
            <h1 style={{ marginBottom: '20px'}}>비밀번호 찾기</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="userId"
                        placeholder="아이디 입력"
                        maxLength={20}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div>
                    <input
                        type="email"
                        id="userEmail"
                        placeholder="이메일 입력"
                        maxLength={60}
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', width: '330px', marginBottom: '10px' }}>찾기</button>

                <div className="additional-links" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>로그인</Link>|
                    <Link to="/join" style={{ textDecoration: 'none' }}>회원 가입</Link>
                </div>
            </form>
        </div>
    );
};

export default FindPw;