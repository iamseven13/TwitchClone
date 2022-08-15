import React, { useEffect, useState } from 'react';
import Axios from 'axios';

async function makePayment() {
	const res = await Axios.post('http://localhost:2000/api/payment');
	console.log(res.data);
}
const ProductDisplay = () => (
	<section>
		<div className="product">
			<img
				src="https://i.imgur.com/EHyR2nP.png"
				alt="The cover of Stubborn Attachments"
			/>
			<div className="description">
				<h3>Stubborn Attachments</h3>
				<h5>$20.00</h5>
			</div>
		</div>
		<form action="http://localhost:2000/api/payment" method="POST">
			<button type="submit">Checkout</button>
		</form>
	</section>
);

const Message = ({ message }) => (
	<section className="order-info">
		<p>{message}</p>
	</section>
);

export default function Product() {
	const [message, setMessage] = useState('');
	console.log('is this running');

	useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		const query = new URLSearchParams(window.location.search);
		console.log(query);

		if (query.get('success')) {
			setMessage('Order placed! You will receive an email confirmation.');
		}

		if (query.get('canceled')) {
			setMessage(
				"Order canceled -- continue to shop around and checkout when you're ready."
			);
		}
	}, []);

	return message ? <Message message={message} /> : <ProductDisplay />;
}
