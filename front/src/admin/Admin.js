import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
	const [hoveredLink, setHoveredLink] = useState(null);
	const navigate = useNavigate();
	const alertShown = useRef(false);

	useEffect(() => {
		const userId = sessionStorage.getItem('userId');
		if (!userId && !alertShown.current) {
			alertShown.current = true;
			alert('로그인 후 이용 바랍니다.');
			navigate('/login');
		}
	}, [navigate]);

	const linkStyle = {
		display: 'block',
		width: '50%',
		padding: '10px',
		border: '1px solid #ccc',
		borderRadius: '5px',
		textAlign: 'center',
		backgroundColor: '#5DD5D5',
		textDecoration: 'none',
		color: 'white',
		cursor: 'pointer',
		transition: 'background-color 0.3s, color 0.3s',
	};

	const hoverStyle = {
		backgroundColor: 'rgb(45, 168, 168)',
	};

	const getLinkStyle = (linkName) => {
		return hoveredLink === linkName ? { ...linkStyle, ...hoverStyle } : linkStyle;
	};

	return (
		<div className="container" style={{
			display: 'flex', flexDirection: 'column',
			alignItems: 'center', justifyContent: 'center', height: '80vh'
		}}>
			<div className="additional-links" style={{
				width: '60%', maxWidth: '400px', padding: '20px', border: '1px solid #ccc',
				borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff',
				display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
			}}>
				<Link to="/userMgt" style={getLinkStyle('userMgt')}
					onMouseEnter={() => setHoveredLink('userMgt')}
					onMouseLeave={() => setHoveredLink(null)}>회원 관리</Link>
				
				<Link to="/inquiryMgt" style={getLinkStyle('inquiryMgt')}
					onMouseEnter={() => setHoveredLink('inquiryMgt')}
					onMouseLeave={() => setHoveredLink(null)}>문의 관리</Link>
				
				<Link to="/commentMgt" style={getLinkStyle('commentMgt')}
					onMouseEnter={() => setHoveredLink('commentMgt')}
					onMouseLeave={() => setHoveredLink(null)}>댓글 관리</Link>
				
				<Link to="/adminInfo" style={getLinkStyle('adminInfo')}
					onMouseEnter={() => setHoveredLink('adminInfo')}
					onMouseLeave={() => setHoveredLink(null)}>관리자 정보</Link>
			</div>
		</div>
	);
}

export default Admin;