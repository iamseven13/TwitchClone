import React, { useEffect } from 'react';

// My components
import FrontPage from './FrontPage';
import SideBar from './Sidebar';
import HeaderLoggedOut from './HeaderLoggedOut';

function HomeGuest() {
	return (
		<div className="container">
			<HeaderLoggedOut />
			<div className="content">
				<SideBar />
				<FrontPage />
			</div>
		</div>
	);
}

export default HomeGuest;
