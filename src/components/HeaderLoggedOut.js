import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import logo from '../img/logo.png';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function HeaderLoggedOut() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	function handleRegister(e) {
		e.preventDefault();
		appDispatch({ type: 'openRegisterForm' });
	}

	function handleLogin(e, data) {
		e.preventDefault();

		appDispatch({ type: 'openLoginForm' });
	}

	return (
		<>
			<header className="header">
				<section className="top-section">
					<img src={logo} alt="logo-alt" className="logo" />
					<nav className="nav-header">
						<ul className="nav-header__ul">
							<li>
								<a>Following</a>
							</li>
							<li>
								<a>Browse</a>
							</li>
							<li>
								<a>
									<svg className="nav-header__icon">
										<IcomoonReact iconSet={iconSet} icon="list2" />
									</svg>
								</a>
							</li>
						</ul>
					</nav>
				</section>
				<form action="#" className="search">
					<input type="text" className="search__input" placeholder="Search" />
					<button className="search__button">
						<svg className="search__icon">
							<IcomoonReact iconSet={iconSet} icon="search" />
						</svg>
					</button>
				</form>
				<nav className="user-nav__logged-out">
					<div className=" logged-out__buttons">
						<a onClick={(e) => handleLogin(e)} className="login-class" href="#">
							Log In
						</a>
						<a onClick={handleRegister} className="register-class" href="#">
							Sign up
						</a>
					</div>
				</nav>
			</header>
		</>
	);
}

export default HeaderLoggedOut;
