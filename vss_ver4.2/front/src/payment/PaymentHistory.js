import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/userInfo');
        setUserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/payments/history/${userId}`);
        setPaymentHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setError('결제 내역을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userId]);

  const calculateExpiryDate = (paymentDate) => {
    const date = new Date(paymentDate);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString();
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payment-history-container">
      <hi2>결제 내역</hi2>
      <button className="back-button" onClick={() => navigate(-1)}>뒤로 가기</button>
      {paymentHistory.length === 0 ? (
        <p className="no-history">결제 내역이 없습니다.</p>
      ) : (
        <div className="table-container">
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>금액</th>
                <th>결제 날짜</th>
                <th>등급 만료일</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.productName}</td>
                  <td>{payment.amount.toLocaleString()}원</td>
                  <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                  <td>{calculateExpiryDate(payment.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;