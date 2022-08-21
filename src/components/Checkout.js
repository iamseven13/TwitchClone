import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import Axios from 'axios';
import { useContext } from 'react';
import StateContext from '../StateContext';

function Checkout() {
	const stripePromise = loadStripe(
		'pk_test_51KZcfXDWV5T7RQOzvaRsBHVISIzZgs5JU8xBhzAUwdjiOl28Daw2yHsBtnSkAoR4o028gcw5BLjGQnY8GiThg3bM00ca8KWgUY'
	);

	const [paymentKey, setPaymentKey] = useState('');
	const [isKeyReady, setIsKeyReady] = useState(false);
	const appState = useContext(StateContext);

	const subToStreamer = appState.profileUser.user.username;

	const config = {
		headers: {
			'x-auth-token': appState.user.token,
			'Content-Type': 'application/json',
		},
	};

	useEffect(() => {
		async function initializePayment() {
			const res = await Axios.post(
				'http://localhost:2000/api/payment',
				{ subToStreamer },
				config
			);
			console.log(res.data);
			if (res.data) {
				setPaymentKey(res.data);
				setIsKeyReady(true);
			} else {
				console.log('there was an issue');
			}
		}
		initializePayment();
	}, []);

	console.log(paymentKey);

	const options = {
		clientSecret: paymentKey,
		appearance: {
			theme: 'night',
			labels: 'floating',
		},
	};

	const [message, setMessage] = useState('');
	console.log('is this running');

	if (!isKeyReady) return <div>Loading...</div>;

	return (
		<Elements stripe={stripePromise} options={options}>
			<CheckoutForm setPaymentKey={setPaymentKey} />
		</Elements>
	);
}

export default Checkout;
