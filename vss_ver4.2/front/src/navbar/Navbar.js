import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import './Button.css';
import logoImage from '../javaboza.png'
const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

const Navbar = () => {
	const [click, setClick] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const location = useLocation();

	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	useEffect(() => {
		const userId = sessionStorage.getItem('userId');
		setIsLoggedIn(!!userId);
	}, [location]);

	const handleLogout = async () => {
		sessionStorage.removeItem('userId');
		sessionStorage.clear();  // 모든 세션 데이터 제거
		localStorage.clear();
		document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		setIsLoggedIn(false);
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		console.log('검색어:', searchTerm);
		// 검색 기능 추가
	};

	const checkButtonStyle = STYLES[1]; // 로그인 상태에서는 btn--outline 스타일 사용
	const checkButtonSize = SIZES[0]; // 기본 사이즈는 btn--medium 사용

	return (
		<>
			<nav className='navbar'>
				<div className='navbar-container'>
					<Link to='/list' className='navbar-logo' onClick={closeMobileMenu}>
						<img src={logoImage} alt="Javaboza" className="logo-image" />
					</Link>
					<div className='menu-icon' onClick={handleClick}>
						<i className={click ? 'fas fa-times' : 'fas fa-bars'} />
					</div>
					<ul className={click ? 'nav-menu active' : 'nav-menu'}>
						<li className='nav-item'>
							<div className='navbar-search'>
								<form onSubmit={handleSearchSubmit}>
									<input
										type='text'
										placeholder='동영상 검색...'
										value={searchTerm}
										onChange={handleSearchChange}
									/>
									<button type='submit' className='btn btn--outline btn--medium'>
										검색
									</button>
								</form>
							</div>
						</li>
						<li className='nav-item'>
							<Link to='/payment' className='nav-links' onClick={closeMobileMenu}>
								결제
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/api/playlists' className='nav-links' onClick={closeMobileMenu}>
								재생목록
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/inquiry' className='nav-links' onClick={closeMobileMenu}>
								문의
							</Link>
						</li>
					</ul>
					<div className='navbar-user' onClick={closeMobileMenu}>
						{isLoggedIn && (
							<Link to={sessionStorage.getItem('userId') === 'admin' ? '/admin' : '/userInfo'} className='nav-links'>
								<span>{sessionStorage.getItem('userId')}님</span>
							</Link>
						)}
						{isLoggedIn ? (
							<Link to ='/login'>
							<button
								className={`btn ${checkButtonStyle} ${checkButtonSize}`}
								onClick={handleLogout}
							>
								로그아웃
							</button>
							</Link>
						) : (
							<Link to='/login' className='btn-mobile'>
								<button className={`btn ${checkButtonStyle} ${checkButtonSize}`}>
									로그인
								</button>
							</Link>
						)}
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
