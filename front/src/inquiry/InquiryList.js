import React, { useState } from 'react';
import { Button, Form, Pagination } from 'react-bootstrap';

const InquiryList = ({
  filteredDepartments,
  currentPage,
  itemsPerPage,
  handleSearchChange,
  handleShowModal,
  handleInquiryClick,
  paginate,
  userId // userId 추가
}) => {
  const [showMyInquiriesOnly, setShowMyInquiriesOnly] = useState(false);

  // 데이터를 역순으로 정렬
  const sortedDepartments = [...filteredDepartments].reverse();

  // 현재 페이지에 표시할 항목 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // userId에 따라 필터링된 문의 목록 생성
  const filteredInquiries = showMyInquiriesOnly
    ? sortedDepartments.filter(inquiry => inquiry.userId === userId)
    : sortedDepartments;

  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredInquiries.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // 제목이 길면 잘라내기
  const truncateTitle = (title) => {
    return title.length > 10 ? title.substring(0, 10) + '...' : title;
  };

  const toggleShowMyInquiries = () => {
    setShowMyInquiriesOnly(!showMyInquiriesOnly);
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="검색어를 입력하세요..."
              onChange={handleSearchChange}
              className="custom-form-control"
            />
          </Form.Group>
        </div>
        <div className="col-auto d-flex align-items-end">
          <Button
            className="custom-btn"
            onClick={() => handleShowModal('insert')}
          >
            글 쓰기
          </Button>
        </div>
        <div className="col-auto d-flex align-items-end">
          <Button
            variant={showMyInquiriesOnly ? 'secondary' : 'primary'}
            onClick={toggleShowMyInquiries}
            className="custom-btn"
          >
            {showMyInquiriesOnly ? '전체 글' : '내 문의 글'}
          </Button>
        </div>
      </div>
      {filteredInquiries.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>답변 여부</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((inquiry, index) => (
                  <tr
                    key={index}
                    onClick={() => handleInquiryClick(inquiry)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* 고유 번호 부여 (전체 목록에서의 순서) */}
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{truncateTitle(inquiry.inquiryTitle)}</td>
                    <td>{inquiry.userId}</td>
                    <td>{new Date(inquiry.inquiryDate).toLocaleDateString('ko-KR')}</td>
                    <td>{inquiry.inquiryAnswer ? 'O' : 'X'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <Pagination className="custom-pagination">
              {pageNumbers.map((number) => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => paginate(number)}
                  className="custom-page-item"
                >
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </>
      ) : (
        <p className="text-center">검색 결과가 없습니다.</p>
      )}
    </>
  );
};

export default InquiryList;
