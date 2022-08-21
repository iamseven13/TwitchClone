import { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

import {
	PaymentElement,
	CardElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
import PaymentStatus from './PaymentStatus';

const CheckoutForm = ({ setPaymentKey }) => {
	const stripe = useStripe();
	const elements = useElements();

	const appDispatch = useContext(DispatchContext);
	const appState = useContext(StateContext);

	const subToStreamer = appState.profileUser.user.username;

	const [errorMessage, setErrorMessage] = useState(null);

	const handleSubmit = async (event) => {
		// We don't want to let default form submission happen here,
		// which would refresh the page.
		event.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		const { error } = await stripe.confirmPayment({
			//`Elements` instance that was used to create the Payment Element
			elements,
			confirmParams: {
				return_url: `http://localhost:3000/${subToStreamer}/?success=true`,
			},
		});

		if (error) {
			// This point will only be reached if there is an immediate error when
			// confirming the payment. Show error to your customer (for example, payment
			// details incomplete)
			setErrorMessage(error.message);
		} else {
			// Your customer will be redirected to your `return_url`. For some payment
			// methods like iDEAL, your customer will be redirected to an intermediate
			// site first to authorize the payment, then redirected to the `return_url`.
		}
	};

	return (
		<div className="checkout-form">
			<p className="card-number-fake">
				Use 4242 4242 4242 4242 for testing purposes provided by Stripe.
			</p>
			<svg
				onClick={(e) => {
					appDispatch({ type: 'closeIsCheckoutForm' });
				}}
				className="user-nav__icon settings-checkoutform"
			>
				<IcomoonReact iconSet={iconSet} icon="cancel-circle" />
			</svg>
			<form onSubmit={handleSubmit} className="form">
				<PaymentElement />
				<button className="form-btn" disabled={!stripe}>
					Submit
				</button>
				{errorMessage && <div>{errorMessage}</div>}
			</form>
		</div>
	);
};

export default CheckoutForm;
