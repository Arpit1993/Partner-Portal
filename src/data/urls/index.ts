import { envConfig } from 'configs/envConfig';

const urls = {
  baseUrl: envConfig('baseUrl')
};

const ids = {
  partnerId: 'instaview',
  clientId: 'web'
};

export { urls, ids };
