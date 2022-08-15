import React, { useEffect } from 'react';

import xqcLogo from '../img/xqc1.jpg';
import hasanLogo from '../img/hasan.jpeg';
import sommerPic from '../img/sommer.png';
import andyPic from '../img/andy.png';
import tfuePic from '../img/tfue.png';
import bobPic from '../img/bob.jpeg';
import dayzPic from '../img/dayz.png';
import landonPic from '../img/landon.png';
import nickPic from '../img/nick.png';

import game1 from '../img/slide1.jpg';
import game2 from '../img/slide2.jpg';
import game3 from '../img/slide3.jpg';
import game4 from '../img/slide4.jpg';
import game5 from '../img/slide5.jpg';

function FrontPage() {
	return (
		<>
			<main className="view">
				<section className="first-section">
					<div className="slides">
						<div className="slide">
							<img src={game1} className="slide__front-game" alt="game 1" />
							<section className="slide__streamer-desc">
								<img
									src={nickPic}
									className="slide__streamer-desc--avatar_photo"
									alt="nick pic"
								/>
								<section className="slide__streamer-desc--info">
									<label className="streamer-name">NICKMERCS</label>
									<label className="streamer-game">Fortnite</label>
									<label className="streamer-viewercount">21.4K viewers</label>
									<p className="streamer-pg">
										Lorem ipsum, dolor sit amet consectetur adipisicing elit.
										Quis expedita tempore quisquam placeat molestias obcaecati?
									</p>
								</section>
							</section>
						</div>
					</div>
				</section>
				<section className="second-section">
					<h2 className="second-section__h2">
						Live channels we think you'll like
					</h2>
					<div className="recommended-channels">
						<div className="first-streamer">
							<img
								src={game2}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={bobPic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>Dominating in Warzone!!</h4>
									<section className="name-game">
										<span>Winger</span>
										<span>Call of Duty: Warzone</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game4}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={tfuePic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>escaping the cornfields of iowa</h4>
									<section className="name-game">
										<span>dellor</span>
										<span>Apex Legends</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game5}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={dayzPic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>Trooper Snow | NoPixel |</h4>
									<section className="name-game">
										<span>uhSnow</span>
										<span>GTA</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game3}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={andyPic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>$2mil Duo Fortnite Tournament</h4>
									<section className="name-game">
										<span className="name-game__span1">Clix</span>
										<span className="name-game__span2">Fortnite</span>
									</section>
								</section>
							</section>
						</div>
					</div>
				</section>
				<section className="third-section">
					<h2 className="second-section__h2">Recommended channels</h2>
					<div className="recommended-channels">
						<div className="first-streamer">
							<img
								src={game2}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={bobPic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>Dominating in Warzone!!</h4>
									<section className="name-game">
										<span>Winger</span>
										<span>Call of Duty: Warzone</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game4}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={tfuePic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>escaping the cornfields of iowa</h4>
									<section className="name-game">
										<span>dellor</span>
										<span>Apex Legends</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game5}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={dayzPic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>Trooper Snow | NoPixel |</h4>
									<section className="name-game">
										<span>uhSnow</span>
										<span>GTA</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game3}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img src={andyPic} className="recommended-desc__avatar" />
								<section className="recommended-desc__streamer-info">
									<h4>$2mil Duo Fortnite Tournament</h4>
									<section className="name-game">
										<span className="name-game__span1">Clix</span>
										<span className="name-game__span2">Fortnite</span>
									</section>
								</section>
							</section>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

export default FrontPage;
