const _envConfig: { [key: string]: string | undefined } = {
  env: process.env['REACT_APP_ENVIRONMENT'],
  baseUrl: process.env['REACT_APP_BASE_URL'],
  stripeKey: process.env['REACT_APP_STRIPE_KEY'],
  partnerId: process.env['PARTNER_ID'],
  clientId: process.env['CLIENT_ID']
};

const envConfig = (key: string) => {
  return _envConfig[key];
};

export { envConfig };
