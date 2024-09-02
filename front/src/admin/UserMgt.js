import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Pagination, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserMgt = () => {
	const navigate = useNavigate();

	// 상태 변수를 정의한다.
	const [members, setMembers] = useState([]); //회원 목록을 저장할 상태 상수를 선언한다.
	const [showModal, setShowModal] = useState(false); //모달 창 표시 여부를 저장할 상태 상수를 선언한다.
	const [modalType, setModalType] = useState(''); //모달 창의 insert, update, delete, select을 저장할 상태 상수를 선언한다.
	const [formData, setFormData] = useState({
		userId: '', userRegdate: '', userGrade: '', userName: ''
		, userAge: '', userEmail: '', userPhone: '', userBdate: ''
	}); //폼 데이터를 저장할 상태 상수를 선언한다.
	const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
	const itemsPerPage = 7; // 페이지 당 항목 수
	const [sortType, setSortType] = useState('alphabetAsc'); // 정렬 유형 상태
	const alertShown = useRef(false);

	// 컴포넌트가 처음 마운트될 때 회원 목록을 로드하는 useEffect 훅을 선언한다.
	useEffect(() => {
		const userId = sessionStorage.getItem('userId');
		if (!userId && !alertShown.current) {
			alertShown.current = true;
			alert('로그인 후 이용 바랍니다.');
			navigate('/login');
		} else {
			loadMembers();
		}
	}, [navigate]);

	// GET 요청으로 회원 목록을 로드하는 비동기 함수를 선언한다
	const loadMembers = async () => {
		try {
			const response = await axios.get('/selectAll'); // 회원 목록을 가져오는 API 호출한다.
			const filteredMembers = response.data.filter(member => member.userId !== 'admin'); // 'admin' 회원 제외
			setMembers(filteredMembers); // 회원 목록을 상태에 저장한다.
		} catch (error) {
			alert('회원 목록에 데이터가 없습니다.'); //오류 발생 시 경고창 표시한다.
		}
	};

	// 정렬 함수
	const sortMembers = (members, type) => {
		return members.slice().sort((a, b) => {
			if (type === 'alphabetAsc') {
				return a.userId.localeCompare(b.userId);
			} else if (type === 'alphabetDesc') {
				return b.userId.localeCompare(a.userId);
			}
			return 0;
		});
	};

	// 모달 창을 표시하는 함수를 선언한다.
	const handleShowModal = (type) => {
		setModalType(type); //모달 타입을 설정한다.
		setShowModal(true); //모달 창을 표시한다.
	};

	// 모달 창을 닫는 함수를 선언한다.
	const handleCloseModal = () => {
		setShowModal(false); //모달 창을 숨긴다.
		setFormData({
			userId: '', userRegdate: '', userGrade: '', userName: ''
			, userAge: '', userEmail: '', userPhone: '', userBdate: ''
		}); //폼 데이터를 초기화한다.
	};

	// 폼 입력 값을 상태에 저장하는 함수를 선언한다.
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		const { userId } = formData;

		try {
			if (modalType === 'delete') {
				const confirmDelete = window.confirm('정말로 회원을 삭제하시겠습니까?');
				if (confirmDelete) {
					const checkResponse = await axios.get(`/check/${userId}`);
					if (checkResponse.data.exists) {
						await axios.delete(`/delete/${userId}`);
						alert('회원을 삭제하였습니다.');
						loadMembers();
					}
				}
			} else if (modalType === 'select') {
				// 검색 정보가 비어있는지 확인
				if (!userId) {
					alert('검색할 회원 정보를 입력하세요.');
					return;
				}
				if (userId === 'admin') {
					alert('올바른 아이디를 입력하세요.');
					setFormData({
						...formData,
						userId: '' // 검색창 초기화
					});
					return; // 함수 실행 중단
				}
				const response = await axios.get('/selectAll');
				// 완전 일치 검색
				const foundExactMember = response.data.find(member => member.userId === userId);
				// 부분 일치 검색
				const filteredMembers = response.data.filter(member => member.userId.includes(userId));
				if (foundExactMember) {
					setMembers([foundExactMember]);
					alert('회원 정보를 조회하였습니다.');
				} else if (filteredMembers.length > 0) {
					setMembers(filteredMembers);
					alert('일치하는 회원을 조회하였습니다.');
				} else {
					alert('일치하는 회원이 없습니다.');
				}
			}
			handleCloseModal();
		} catch (error) {
			alert('오류가 발생하였습니다.');
		}
	};
	
	// 페이지 번호 배열 생성
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(members.length / itemsPerPage); i++) {
		pageNumbers.push(i);
	}

	// 페이지 변경 처리 함수
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	// 정렬 타입 변경 함수
	const handleSortChange = (sortType) => {
		setSortType(sortType);
	};

	// 현재 페이지에 해당하는 항목들만 가져오기
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const sortedMembers = sortMembers(members, sortType);
	const currentMembers = sortedMembers.slice(indexOfFirstItem, indexOfLastItem);

	const buttonStyle = {
		marginRight: '5px'
	};

	return (
		<div style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '20px', width: '700px', textAlign: 'center' }}>

			<div className="btn-group-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>

				<Button variant="outline-secondary" style={buttonStyle} onClick={() => navigate('/admin')}>관리 목록</Button>
				<Button variant="outline-secondary" style={buttonStyle} onClick={loadMembers}>전체 목록</Button>
				<Button variant="outline-secondary" style={buttonStyle} onClick={() => handleShowModal('select')}>회원 검색</Button>

				<Dropdown onSelect={handleSortChange}>
					<Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">정렬</Dropdown.Toggle>
					<Dropdown.Menu style={{ minWidth: 'auto' }}>
						<Dropdown.Item eventKey="alphabetAsc">오름차순</Dropdown.Item>
						<Dropdown.Item eventKey="alphabetDesc">내림차순</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>

			</div>
			<div className="custom-table-wrapper">
				<Table className="custom-table" style={{ textAlign: 'center' }}>
					<thead>
						<tr><th>아이디</th><th>가입 날짜</th><th>등급</th><th>상세 정보</th></tr>
					</thead>

					<tbody>
						{currentMembers.map(member => (
							<tr key={member.userId}>
								<td style={{ verticalAlign: 'middle', padding: '5px', lineHeight: '1' }}>{member.userId}</td>
								<td style={{ verticalAlign: 'middle', padding: '5px', lineHeight: '1' }}>{member.userRegdate}</td>
								<td style={{ verticalAlign: 'middle', padding: '5px', lineHeight: '1' }}>{member.userGrade}</td>
								<td>
									{/* 상세 회원 정보 버튼 */}
									<Button variant="outline-secondary" size="sm" onClick={() => navigate(`/adminUserInfo/${member.userId}`)}>보기</Button>
								</td>
							</tr>
						))}
					</tbody>

				</Table>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Pagination>
						<Pagination.First onClick={() => handlePageChange(1)} />
						<Pagination.Prev onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} />
						{pageNumbers.map(number => (
							<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
								{number}
							</Pagination.Item>
						))}
						<Pagination.Next onClick={() => handlePageChange(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)} />
						<Pagination.Last onClick={() => handlePageChange(pageNumbers.length)} />
					</Pagination>
				</div>
			</div>

			{/* 모달 창 */}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>{modalType === 'select' ? '회원 검색' : '회원 삭제'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formUserId">
							<Form.Control
								type="text"
								placeholder="아이디를 입력하세요"
								name="userId"
								value={formData.userId}
								onChange={handleChange}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						취소
					</Button>
					<Button variant="primary" onClick={handleSubmit}>
						{modalType === 'select' ? '검색' : '삭제'}
					</Button>
				</Modal.Footer>
			</Modal>

		</div>
	);
}

export default UserMgt;