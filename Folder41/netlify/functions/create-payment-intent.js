const Stripe = require('stripe');
const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // Replace with your Stripe Secret Key

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Method Not Allowed' }),
            };
        }

        const { amount, currency } = JSON.parse(event.body);

        if (!amount || !currency) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Amount and currency are required' }),
            };
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        };
    } catch (error) {
        console.error('Stripe Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};