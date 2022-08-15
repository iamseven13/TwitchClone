import React, { useEffect, useContext } from 'react';

import logo from '../img/logo.png';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import userPic from '../img/user.jpg';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { Link } from 'react-router-dom';

function HeaderLoggedIn() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	return (
		<>
			<header className="header">
				<section className="top-section">
					<Link to="/">
						<img src={logo} alt="logo-alt" className="logo" />
					</Link>

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
				<nav className="user-nav">
					<div className="user-nav__icon-box">
						<svg className="user-nav__icon">
							<IcomoonReact iconSet={iconSet} icon="podcast" />
						</svg>
						<span className="user-nav__notification">7</span>
					</div>
					<div className="user-nav__icon-box">
						<svg className="user-nav__icon">
							<IcomoonReact iconSet={iconSet} icon="eye" />
						</svg>
						<span className="user-nav__notification">14</span>
					</div>
					<div className="user-nav__icon-box">
						<svg className="user-nav__icon">
							<IcomoonReact iconSet={iconSet} icon="bubble" />
						</svg>

						<span className="user-nav__notification">12</span>
					</div>
					<Link to="/payment/stripe" className="user-nav__icon-box">
						<svg className="user-nav__icon">
							<IcomoonReact iconSet={iconSet} icon="star-empty" />
						</svg>
					</Link>

					<div
						onClick={(e) => {
							appDispatch({ type: 'openSettingsPopup' });
						}}
						className="user-nav__user"
					>
						<img
							src={appState.user.avatar}
							alt="user pic"
							className="user-nav__user-photo"
						/>
						<span className="user-nav__user-name">
							{appState.user.username}
						</span>
					</div>
				</nav>
			</header>
		</>
	);
}

export default HeaderLoggedIn;
