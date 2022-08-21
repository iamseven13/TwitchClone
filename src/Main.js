import './main.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// App context - state management
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

// My components
import HeaderLoggedIn from './components/HeaderLoggedIn';
import SideBar from './components/Sidebar';
import FrontPage from './components/FrontPage';
import HeaderLoggedOut from './components/HeaderLoggedOut';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Settings from './components/Settings';
import ProfileOffline from './components/ProfileOffline';
import Dashboard from './components/Dashboard';
import Product from './components/Product';
import EditProfile from './components/EditProfile';
import Checkout from './components/Checkout';

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('twitchUserToken')),
		user: {
			username: localStorage.getItem('twitchUserUsername'),
			token: localStorage.getItem('twitchUserToken'),

			avatar: localStorage.getItem('twitchUserAvatar'),
			date: localStorage.getItem('twitchUserDate'),
			id: localStorage.getItem('twitchUserId'),
			streamKey: localStorage.getItem('streamId'),
		},
		isRegisterOpen: false,
		isLoginOpen: false,
		isSettingsOpen: false,
		isUserLive: false,
		profileUser: {
			user: {
				username: '',
				avatar: '',
				date: '',
				id: '',
				streamKey: '',
				isLive: false,
				subscribers: [],
			},
		},
		isDashboard: false,
		setRequestFollowingUpdate: false,
		isCheckoutFormOpen: false,
	};

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true;
				draft.user = action.data;
				draft.isDashboard = true;

				break;

			case 'logout':
				draft.loggedIn = false;
				break;
			case 'openRegisterForm':
				draft.isRegisterOpen = true;
				break;

			case 'closeRegisterForm':
				draft.isRegisterOpen = false;
				break;

			case 'openLoginForm':
				draft.isLoginOpen = true;
				break;
			case 'closeLoginForm':
				draft.isLoginOpen = false;
				break;

			case 'openSettingsPopup':
				draft.isSettingsOpen = true;
				break;
			case 'closeSettingsPopUp':
				draft.isSettingsOpen = false;
				break;
			case 'userGoLive':
				draft.profileUser.user.isLive = true;
				break;
			case 'userGoOffline':
				draft.profileUser.user.isLive = false;
				break;
			case 'profileUser':
				draft.profileUser = action.data;
				break;
			case 'setRequestFollowingUpdate':
				draft.setRequestFollowingUpdate = true;
				break;
			case 'UnsetRequestFollowingUpdate':
				draft.setRequestFollowingUpdate = false;
				break;
			case 'openIsCheckoutForm':
				draft.isCheckoutFormOpen = true;
				break;
			case 'closeIsCheckoutForm':
				draft.isCheckoutFormOpen = false;
				break;
			default:
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('twitchUserToken', state.user.token);
			localStorage.setItem('twitchUserUsername', state.user.username);
			localStorage.setItem('twitchUserAvatar', state.user.avatar);
			localStorage.setItem('twitchUserDate', state.user.date);
			localStorage.setItem('twitchUserId', state.user.id);
			localStorage.setItem('streamId', state.user.streamKey);
		} else {
			localStorage.removeItem('twitchUserToken');
			localStorage.removeItem('twitchUserUsername');
			localStorage.removeItem('twitchUserAvatar');
			localStorage.removeItem('twitchUserDate');
			localStorage.removeItem('twitchUserId');
			localStorage.removeItem('streamId');
		}
	}, [state.loggedIn]);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<div className="container">
						{state.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
						<div className="content">
							<SideBar />
							<Switch>
								<Route path="/" element={<FrontPage />}></Route>
								<Route path="/:username" element={<Profile />}></Route>
								<Route path="*" element={<NotFound />} exact></Route>
								<Route
									path="/dashboard"
									element={<Dashboard loggedIn={state.loggedIn} />}
								></Route>
								<Route path="/payment/stripe" element={<Product />}></Route>
								<Route path="/settings" element={<EditProfile />}></Route>

								<Route
									path="/order/123/complete/*"
									exact
									element={<NotFound />}
								></Route>
							</Switch>
						</div>
					</div>

					{state.isRegisterOpen ? <Register /> : ''}
					{state.isLoginOpen ? <Login /> : ''}
					{state.isSettingsOpen ? <Settings /> : ''}
					{state.isCheckoutFormOpen ? <Checkout /> : ''}
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

export default Main;
