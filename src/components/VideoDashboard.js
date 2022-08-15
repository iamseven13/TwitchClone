import React, { useEffect, useContext } from 'react';
import DispatchContext from '../DispatchContext';
import ReactPlayer from 'react-player';
import StateContext from '../StateContext';

function VideoDashboard(props) {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	console.log(appState.profileUser.user.isLive);

	function handleUserIsLive() {
		appDispatch({ type: 'userGoLive' });
		console.log('user is live');
	}
	function handleUserIsOffline() {
		console.log('this is run');
		appDispatch({ type: 'userGoOffline' });
	}

	return (
		<ReactPlayer
			url={`http://164.92.134.131:8080/hls/${appState.user.streamKey}.m3u8`}
			playing="true"
			// onReady={handleUserIsLive}
			forceHLS
			width="fit-content"
			height="464"
			muted
			controls="true"
			stopOnUnmount={false}
			onBufferEnd={handleUserIsLive}
			onEnded={handleUserIsOffline}
		/>
		// <div>
		// 	<video
		// 		autoPlay
		// 		data-setup='{"fluid": true}'
		// 		id="player"
		// 		class="video-js video-stream vjs-big-play-centered"
		// 		controls
		// 		preload="metadata"
		// 		width="1010px"
		// 		height="464"
		// 		poster="MY_VIDEO_POSTER.jpg"
		// 	>
		// 		<source
		// 			src="http://164.92.134.131:8080/hls/8c034b1b-3a25-47bb-a778-2bffbd5641c1.m3u8"
		// 			type="application/x-mpegURL"
		// 		/>
		// 	</video>
		// </div>
	);
}

export default VideoDashboard;
