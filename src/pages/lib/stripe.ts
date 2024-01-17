import Stripe  from 'stripe'

export const stripe = new Stripe(`sk_test_51OWnDxHmMS3ezIkisDsm12HnNtn5b5jeDlNhdN7Ta3shiALG69DKAmmUAyqqzVAvU5ZwW8kgsyWfKE516YrkCot800nVTazYSI`, {
    apiVersion: '2023-10-16',
    appInfo: {
        name: 'ignite-shop',
    }
});