import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
    const [selectedGrade, setSelectedGrade] = useState('Silver');
    const [userGrade, setUserGrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const { data: userInfo } = await axios.get('/userInfo');
                setUserGrade(userInfo.userGrade);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error fetching user info:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        };
    }, []);

    const handleGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };

    const requestPay = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            alert('로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
            return;
        }

        try {
            const { data: userInfo } = await axios.get('/userInfo');
            const { IMP } = window;
            IMP.init('imp54544673');

            IMP.request_pay({
                pg: 'html5_inicis.INIpayTest',
                pay_method: 'card',
                merchant_uid: new Date().getTime(),
                name: `${selectedGrade} 등급 결제`,
                amount: getAmountByGrade(selectedGrade),
                buyer_email: userInfo.userEmail,
                buyer_name: userInfo.userName,
                buyer_tel: userInfo.userPhone,
            }, async (rsp) => {
                if (rsp.success) {
                    const userId = userInfo.userId;
                    axios.defaults.baseURL = 'http://localhost:3000';
                    
                    // Save payment information
                    await axios.post('/payments/savePayment', {
                        userId: userId,
                        productName: selectedGrade,
                        amount: getAmountByGrade(selectedGrade)
                    });

                    // Request grade update
                    const response = await axios.put(`/updateGrade/${userId}`, {
                        userGrade: selectedGrade
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.status === 200) {
                        alert('결제 및 등급 업데이트가 완료되었습니다.');
                        setUserGrade(selectedGrade);
                        window.location.reload();
                    } else {
                        alert('등급 업데이트에 실패했습니다.');
                    }
                } else {
                    alert('결제 실패');
                }
            });
        } catch (error) {
            console.error('Error during payment:', error);
            alert('결제 과정에서 오류가 발생했습니다. 로그인 정보를 확인 해 주세요.');
        }
    };

    const getAmountByGrade = (grade) => {
        switch (grade) {
            case 'Silver': return 101;
            case 'Gold': return 102;
            case 'Platinum': return 103;
            case 'Diamond': return 104;
            default: return 0;
        }
    };

    const navigateToPaymentHistory = () => {
        navigate('/PaymentHistory');
    };

    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (!isLoggedIn) {
        return (
            <div className="payment-container">
                <div className="info-container">
                    <h3 className="info-title">로그인 후 이용해 주세요</h3>
                    <p className="info-text">결제를 위해서는 로그인이 필요합니다.</p>
                    <button onClick={() => navigate('/login')} className="login-button">
                        로그인 페이지로 이동
                    </button>
                </div>
            </div>
        );
    }

    if (userGrade !== 'Bronze') {
        return (
            <div className="payment-container">
                <div className="info-container">
                    <h3 className="info-title">현재 등급: {userGrade}</h3>
                    <p className="info-text">이미 결제가 완료된 회원입니다.</p>
                    <button onClick={navigateToPaymentHistory} className="history-button">
                        결제 내역 보기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <h3 className="payment-title">결제할 등급 선택</h3>
            <select
                value={selectedGrade}
                onChange={handleGradeChange}
                className="payment-select"
            >
                <option value="Silver">Silver 등급 - 101원</option>
                <option value="Gold">Gold 등급 - 102원</option>
                <option value="Platinum">Platinum 등급 - 103원</option>
                <option value="Diamond">Diamond 등급 - 104원</option>
            </select>
            <button
                onClick={requestPay}
                className="payment-button"
            >
                아임포트 이니시스 결제
            </button>
            <button onClick={navigateToPaymentHistory} className="history-button">
                결제 내역 보기
            </button>
        </div>
    );
};

export default Payment;
