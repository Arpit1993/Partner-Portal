/* eslint-disable import/no-extraneous-dependencies */
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
// import envConfig from './envConfig';

const stripePromise = loadStripe(
  'pk_test_51NfxsBHKordj7hJCdMOas7xztVVIUjqcrFyWN9n8cO2m1ESfyD1NHdHbTrcZ3Uge8zVxGI1l785gYdEgCSeglWjb00v33MWjll'
);
const stripeOptions: StripeElementsOptions = {
  clientSecret: '',
  appearance: {
    theme: 'stripe',
    variables: {
      fontFamily: 'Sohne, system-ui, sans-serif',
      fontWeightNormal: '500',
      borderRadius: '8px',
      colorBackground: 'black',
      colorPrimary: '#EFC078',
      colorPrimaryText: '#1A1B25',
      colorText: 'black',
      colorTextSecondary: 'black',
      colorTextPlaceholder: '#727F96',
      colorIconTab: 'black',
      colorLogo: 'dark'
    },
    rules: {
      '.Input, .Block': {
        backgroundColor: 'transparent',
        border: '1.5px solid #F0F4F4',
        borderRadius: '25px'
      }
    }
  }
};

export { stripeOptions, stripePromise };
