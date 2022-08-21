const { v4: uuidv4 } = require('uuid');
const config = require('config');

const stripe = require('stripe')(config.get('stripeKey'));

const uuid = uuidv4();

const YOUR_DOMAIN = 'http://localhost:3000/payment/stripe';
exports.stripePayment = async (req, res) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 1099,
		currency: 'usd',
		metadata: {
			order_id: uuid,
			user_id: req.user.id,
			subToStreamer: req.body.subToStreamer,
		},
		automatic_payment_methods: { enabled: true },
	});
	console.log(paymentIntent);

	return res.json(paymentIntent.client_secret);

	// const session = await stripe.checkout.sessions.create({
	// 	line_items: [
	// 		{
	// 			// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
	// 			price: 'price_1LUqWSDWV5T7RQOzamx7xe28',
	// 			quantity: 1,
	// 		},
	// 	],
	// 	mode: 'subscription',
	// 	metadata: { order_id: '123' },
	// 	success_url: `${YOUR_DOMAIN}?success=true`,
	// 	cancel_url: `${YOUR_DOMAIN}?canceled=true`,
	// });

	// res.redirect(303, session.url);
};
