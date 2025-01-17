const Stripe = require('stripe');
const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // Replace with your Stripe Secret Key

exports.handler = async (event) => {
    try {
        const sig = event.headers['stripe-signature'];
        const endpointSecret = 'whsec_YOUR_WEBHOOK_SECRET'; // Replace with your webhook secret

        let stripeEvent;
        try {
            stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
        } catch (err) {
            console.error('Webhook Error:', err.message);
            return { statusCode: 400, body: `Webhook Error: ${err.message}` };
        }

        switch (stripeEvent.type) {
            case 'payment_intent.succeeded':
                console.log('Payment succeeded:', stripeEvent.data.object);
                break;
            case 'payment_intent.payment_failed':
                console.log('Payment failed:', stripeEvent.data.object);
                break;
            default:
                console.log(`Unhandled event type ${stripeEvent.type}`);
        }

        return { statusCode: 200, body: 'Webhook received!' };
    } catch (error) {
        console.error('Error in webhook handler:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};