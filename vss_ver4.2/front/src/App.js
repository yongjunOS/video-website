import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './member/Login';
import Join from './member/Join';
import FindId from './member/FindId';
import FindPw from './member/FindPw';
import UserInfo from './member/UserInfo';
import UpdateInfo from './member/UpdateInfo';
import Admin from './admin/Admin'
import UserMgt from './admin/UserMgt'
import AdminUserInfo from './admin/AdminUserInfo'
import AdminInfo from './admin/AdminInfo'
import Comments from './comments/Comments';
import VideoAll from './video/VideoAll'
import VideoDe from './video/VideoDe'
import VideoUp from './video/VideoUp'
import VideoUplo from './video/VideoUplo'
import VideoDel from './video/VideoDel'
import Inquiry from './inquiry/Inquiry';
import PlaylistList from './playlists/PlaylistList';
import Navbar from './navbar/Navbar';
import Payment from './payment/Payment';
import PaymentHistory from './payment/PaymentHistory';
import CommentMgt from './admin/CommentMgt';


const App = () => {
	return (
		<Router>
			<Navbar />
			<div className="app">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/join" element={<Join />} />
					<Route path="/login" element={<Login />} />
					<Route path="/findId" element={<FindId />} />
					<Route path="/findPw" element={<FindPw />} />
					<Route path="/userInfo" element={<UserInfo />} />
					<Route path="/updateInfo" element={<UpdateInfo />} />

					<Route path="/admin" element={<Admin />} />
					<Route path="/adminInfo" element={<AdminInfo />} />
					<Route path="/userMgt" element={<UserMgt />} />
					<Route path="/adminUserInfo/:userId" element={<AdminUserInfo />} />
					<Route path="/comments" element={<Comments />} />
					<Route path="/inquiry" element={<Inquiry />} />
					<Route path="/list" element={<VideoAll />} />
					<Route path="/videosDetail/:videoNum" element={<VideoDe />} />
					<Route path="/videosUpdate/:videoNum" element={<VideoUp />} />
					<Route path="/videosDelete/:videoNum" element={<VideoDel />} />
					<Route path="/upload" element={<VideoUplo />} /> {/* 업로드 페이지 라우팅 추가 */}
					<Route path="/api/playlists" element={<PlaylistList />} />
					<Route path="/payment" element={<Payment />} />
					<Route path="/paymentHistory" element={<PaymentHistory />} />
					<Route path="/commentMgt" element={<CommentMgt />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
