type ICURRENCY = {
  [key: string]: string;
};
export const CURRENCY: ICURRENCY = {
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const CUSTOMER_SERVICE = {
  email: 'support@instaview.ai',
  phone: '800-111-1111'
};

export const SUBSCRIBE_STATUS = {
  Active: 'Active',
  Cancelled: 'Cancelled'
};

export const DATASHEET_FILE_MAXIMUM_SIZE = 10 * 1024 * 1024;
