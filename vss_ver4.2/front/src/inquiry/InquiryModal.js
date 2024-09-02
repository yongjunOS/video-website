import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InquiryModal = ({
	showModal,
	handleCloseModal,
	modalType,
	formData = { inquiryTitle: '', inquiryContent: '', inquiryAnswer: '' }, // 기본 값 설정
	handleChange,
	handleSubmit,
	handleCancelUpdate,
	handleDelete,
	handleReply,
	selectedInquiryDetail,
	userId,
	handleShowUpdateModal,
	handleShowReplyModal
}) => {
	const maxTitleLength = 50;
	const maxContentLength = 500;

	const [titleLength, setTitleLength] = useState(0);
	const [contentLength, setContentLength] = useState(0);

	useEffect(() => {
		if (formData && formData.inquiryTitle && formData.inquiryContent) {
			setTitleLength(formData.inquiryTitle.length);
			setContentLength(formData.inquiryContent.length);
		}
	}, [formData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		
		if (name === 'inquiryTitle' && value.length > maxTitleLength) {
			alert('문의 제목은 50자 이내로 작성해주세요.');
			return;
		}

		if (name === 'inquiryContent' && value.length > maxContentLength) {
			alert('문의 내용은 500자 이내로 작성해주세요.');
			return;
		}

		handleChange(e);

		if (name === 'inquiryTitle') {
			setTitleLength(value.length);
		}

		if (name === 'inquiryContent') {
			setContentLength(value.length);
		}
	};

	const handleModalClose = () => {
		setTitleLength(0);
		setContentLength(0);
		handleCloseModal();
	};

	const handleFormSubmit = () => {
		setTitleLength(0);
		setContentLength(0);
		handleSubmit();
	};

	const handleUpdateCancel = () => {
		setTitleLength(0);
		setContentLength(0);
		handleCancelUpdate();
	};

	const handleReplySubmit = () => {
		setTitleLength(0);
		setContentLength(0);
		handleReply();
	};

	return (
		<Modal show={showModal} onHide={handleModalClose} animation={false} backdrop={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					{modalType === 'select' && '문의 상세 정보'}
					{modalType === 'insert' && '새로운 문의 등록'}
					{modalType === 'update' && '문의 수정'}
					{modalType === 'reply' && '문의 답변'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{modalType === 'select' && (
					<>
						<p>
							<strong>작성자:</strong> {selectedInquiryDetail.userId}
						</p>
						<p>
							<strong>작성일:</strong>{' '}
							{new Date(selectedInquiryDetail.inquiryDate).toLocaleString('ko-KR', {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
								hour: 'numeric',
								minute: 'numeric',
								second: 'numeric'
							})}
						</p>
						<hr />
						<p>
							<strong>문의 제목:</strong> {selectedInquiryDetail.inquiryTitle}
						</p>
						<p>
							<strong>문의 내용:</strong> {selectedInquiryDetail.inquiryContent}
						</p>
						<p>
							<strong>답변 내용:</strong> {selectedInquiryDetail.inquiryAnswer || '아직 답변이 등록되지 않았습니다.'}
						</p>
						{userId === selectedInquiryDetail.userId && userId !== 'admin' ? (
							<div className="text-end">
								<Button variant="outline-secondary" onClick={handleShowUpdateModal} className="custom-btn">
									수정
								</Button>{' '}
								<Button variant="outline-danger" onClick={handleDelete} className="custom-btn">
									삭제
								</Button>
							</div>
						) : null}
						{userId === 'admin' && (
							<div className="text-end">
								<Button variant="outline-secondary" onClick={handleShowUpdateModal} className="custom-btn">
									수정
								</Button>{' '}
								<Button variant="outline-danger" onClick={handleDelete} className="custom-btn">
									삭제
								</Button>
								<Button variant="outline-success" onClick={handleShowReplyModal} className="custom-btn">
									답변
								</Button>
							</div>
						)}
					</>
				)}
				{modalType === 'insert' && (
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>문의 제목</Form.Label>
							<Form.Control
								type="text"
								name="inquiryTitle"
								value={formData.inquiryTitle}
								onChange={handleInputChange}
								required
							/>
							<small>{titleLength}/{maxTitleLength}자</small>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>문의 내용</Form.Label>
							<Form.Control
								as="textarea"
								rows={10}
								name="inquiryContent"
								value={formData.inquiryContent}
								onChange={handleInputChange}
								required
								className="custom-textarea"
							/>
							<small>{contentLength}/{maxContentLength}자</small>
						</Form.Group>
						<Button variant="primary" onClick={handleFormSubmit} className="custom-btn">
							등록
						</Button>{' '}
						<Button variant="secondary" onClick={handleModalClose} className="custom-btn">
							취소
						</Button>
					</Form>
				)}
				{modalType === 'update' && (
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>문의 제목</Form.Label>
							<Form.Control
								type="text"
								name="inquiryTitle"
								value={formData.inquiryTitle}
								onChange={handleInputChange}
								required
							/>
							<small>{titleLength}/{maxTitleLength}자</small>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>문의 내용</Form.Label>
							<Form.Control
								as="textarea"
								rows={10}
								name="inquiryContent"
								value={formData.inquiryContent}
								onChange={handleInputChange}
								required
								className="custom-textarea"
							/>
							<small>{contentLength}/{maxContentLength}자</small>
						</Form.Group>
						<Button variant="primary" onClick={handleFormSubmit} className="custom-btn">
							수정
						</Button>{' '}
						<Button variant="secondary" onClick={handleUpdateCancel} className="custom-btn">
							취소
						</Button>
					</Form>
				)}
				{modalType === 'reply' && (
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>답변</Form.Label>
							<Form.Control
								as="textarea"
								rows={10}
								name="inquiryAnswer"
								value={formData.inquiryAnswer}
								onChange={handleInputChange}
								required
								className="custom-textarea"
							/>
							<small>{contentLength}/{maxContentLength}자</small>
						</Form.Group>
						<Button variant="primary" onClick={handleReplySubmit} className="custom-btn">
							답변 등록
						</Button>{' '}
						<Button variant="secondary" onClick={handleModalClose} className="custom-btn">
							취소
						</Button>
					</Form>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default InquiryModal;
