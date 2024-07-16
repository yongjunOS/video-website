import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Inquiry.css';
import InquiryList from './InquiryList';
import InquiryModal from './InquiryModal';

const Inquiry = () => {
	const [departments, setDepartments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState('');
	const [formData, setFormData] = useState({ inquiryTitle: '', inquiryContent: '', inquiryAnswer: '' });
	const [selectedInquiry, setSelectedInquiry] = useState(null);
	const [selectedInquiryDetail, setSelectedInquiryDetail] = useState({});
	const [userId, setUserId] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const storedUserId = sessionStorage.getItem('userId');
		if (storedUserId) {
			setUserId(storedUserId);
		}
		loadDepartments();
	}, []);

	const loadDepartments = async () => {
		try {
			const response = await axios.get('/inquiry/selectAll');
			const sortedDepartments = response.data.sort((b, a) => b.inquiryNum - a.inquiryNum); // 역순으로 정렬
			setDepartments(sortedDepartments);
		} catch (error) {
			alert('문의 목록에 데이터가 없습니다.');
		}
	};

	const handleShowModal = (type) => {
		if (userId) {
			setModalType(type);
			setShowModal(true);
		} else {
			const confirmLogin = window.confirm('로그인이 필요합니다. 로그인 하시겠습니까?');
			if (confirmLogin) {
				window.location.href = '/login'; // 로그인 페이지로 이동
			}
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setFormData({ inquiryTitle: '', inquiryContent: '', inquiryAnswer: '' });
		setSelectedInquiry(null);
		setSelectedInquiryDetail({}); // 상세 정보 초기화
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleInquiryClick = async (inquiry) => {
		setSelectedInquiry(inquiry);
		setModalType('select');
		setShowModal(true);
		try {
			const response = await axios.get(`/inquiry/select/${inquiry.inquiryNum}`);
			setSelectedInquiryDetail(response.data); // 선택된 문의의 상세 정보 설정
		} catch (error) {
			alert('문의 상세 정보를 불러오는 데 실패했습니다.');
		}
	};

	const handleShowUpdateModal = async () => {
		if (!selectedInquiry) return;

		try {
			const response = await axios.get(`/inquiry/select/${selectedInquiry.inquiryNum}`);
			setFormData({
				inquiryTitle: response.data.inquiryTitle,
				inquiryContent: response.data.inquiryContent
			});
			setModalType('update');
			setShowModal(true);
		} catch (error) {
			alert('문의 상세 정보를 불러오는 데 실패했습니다.');
		}
	};

	const handleShowReplyModal = async () => {
		if (!selectedInquiry) return;

		try {
			const response = await axios.get(`/inquiry/select/${selectedInquiry.inquiryNum}`);
			setFormData({
				inquiryAnswer: response.data.inquiryAnswer
			});
			setModalType('reply');
			setShowModal(true);
		} catch (error) {
			alert('문의 답변 정보를 불러오는 데 실패했습니다.');
		}
	};

	const handleCancelUpdate = () => {
		setModalType('select');
	};

	const handleDelete = async () => {
		if (!selectedInquiry) return;

		if (userId !== selectedInquiry.userId && userId !== 'admin') {
			alert('본인이 작성한 문의만 삭제할 수 있습니다.');
			return;
		}

		const confirmDelete = window.confirm('정말로 이 문의를 삭제하시겠습니까?');
		if (!confirmDelete) return;

		try {
			await axios.delete(`/inquiry/delete/${selectedInquiry.inquiryNum}`);
			alert('문의가 성공적으로 삭제되었습니다.');
			loadDepartments();
			handleCloseModal();
		} catch (error) {
			alert('문의 삭제 중 오류가 발생했습니다.');
		}
	};

	const handleSubmit = async () => {
		const { inquiryTitle, inquiryContent } = formData;
		const inquiryDate = new Date().toISOString();

		try {
			if (modalType === 'insert') {
				await axios.post('/inquiry/insert', { inquiryTitle, inquiryContent, inquiryDate, userId });
				alert('문의를 등록하였습니다.');
				loadDepartments();
			} else if (modalType === 'update' && selectedInquiry) {
				if (userId !== selectedInquiry.userId && userId !== 'admin') {
					alert('본인이 작성한 문의만 수정할 수 있습니다.');
					return;
				}
				await axios.put(`/inquiry/update/${selectedInquiry.inquiryNum}`, { inquiryTitle, inquiryContent });
				alert('문의를 수정하였습니다.');
				loadDepartments();
			}
			handleCloseModal();
		} catch (error) {
			alert('작업을 완료할 수 없습니다.');
		}
	};

	const handleReply = async () => {
		const { inquiryAnswer } = formData;

		if (userId !== 'admin') {
			alert('관리자만 답변할 수 있습니다.');
			return;
		}

		try {
			await axios.put(`/inquiry/reply/${selectedInquiry.inquiryNum}`, { inquiryAnswer });
			alert('답변을 등록하였습니다.');
			loadDepartments();
			handleCloseModal();
		} catch (error) {
			alert('답변 등록 중 오류가 발생했습니다.');
		}
	};

	// 검색 기능 관련 함수들
	const filteredDepartments = departments.filter((inquiry) =>
		(inquiry.inquiryTitle?.includes(searchTerm) || false) ||
		(inquiry.inquiryContent?.includes(searchTerm) || false)
	);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1); // 검색 시 첫 페이지로 초기화
	};

	// 페이징 처리 관련 변수 및 함수
	const itemsPerPage = 10; // 페이지당 보여줄 아이템 수
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="container p-3 my-3 border">
			<InquiryList
				filteredDepartments={filteredDepartments}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				handleSearchChange={handleSearchChange}
				handleShowModal={handleShowModal}
				handleInquiryClick={handleInquiryClick}
				paginate={paginate}
				userId={userId} // userId 전달
			/>

			<InquiryModal
				showModal={showModal}
				handleCloseModal={handleCloseModal}
				modalType={modalType}
				formData={formData}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				handleCancelUpdate={handleCancelUpdate}
				handleDelete={handleDelete}
				handleReply={handleReply}
				selectedInquiryDetail={selectedInquiryDetail}
				userId={userId}
				handleShowUpdateModal={handleShowUpdateModal}
				handleShowReplyModal={handleShowReplyModal}
			/>
		</div>
	);
};

export default Inquiry;
