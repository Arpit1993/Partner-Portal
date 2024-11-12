export const PIGGYBANK_ENDPOINTS = {
  SUBSCRIPTION_BUY_URL: '/piggybank/subscriptions',
  SUBSCRIPTION_UPGRADE_URL: '/piggybank/subscriptions/upgrade',
  CREATE_PURCHASE_ID_URL: '/piggybank/purchases',
  CHECK_TRIAL_URL: '/piggybank/purchases/trial',
  PAYMENT_METHODS_URL: '/piggybank/payment_gateway/payment_methods',
  SETUP_INTENT_URL: '/piggybank/payment_gateway/setup_intents',
  PLANS_URL: 'piggybank/products/skus?country=US&product_ids=1,2,3',
  GET_TRANSACTION_URL: (page: number) =>
    `/piggybank/purchases/transactions?page=${page}&limit=10`
};

export const ZEUS_ENDPOINTS = {
  FORGOT_PASSWORD_URL: 'zeus/v2/oems/auth/forgot-password',
  RESET_PASSWORD_URL: 'zeus/v2/oems/auth/reset-password',
  OEM_DETAILS: (oemId: string) => `zeus/v2/oems/${oemId}`,
  CHANGE_PASSWORD_URL: (oemId: string, userId: string) =>
    `zeus/oems/${oemId}/users/${userId}/password`,
  USER_DETAILS: (oemId: string, userId: string) =>
    `zeus/oems/${oemId}/users/${userId}`,
  USER_LOGIN_URL: `zeus/v2/oems/auth/login`,
  GET_OEM_USERS: (oemId: string) => `zeus/v2/oems/${oemId}/users`,
  GET_DEVICE_MODELS: (oemId: string) => `zeus/v2/oems/${oemId}/device-models`,
  ADD_OEM_USER: (oemId: string) => `zeus/v2/oems/${oemId}/users`,
  EDIT_OEM_USER: (oemId: string, userId: string) =>
    `zeus/v2/oems/${oemId}/users/${userId}`,
  DELETE_OEM_USER: (oemId: string, userId: string) =>
    `zeus/v2/oems/${oemId}/users/${userId}`,

  ENGINEERING: {
    GET_ALL_DEVICE_MODELS: (oemId: string, params?: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models${params}`,
    UPDATE_DEVICE_MODELS: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}`,
    CREATE_DEVICE_MODEL: (oemId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models`,
    GET_DEVICE_MODEL: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}`, // Api needs to be changed
    GET_DEVICE_FIRMWARES: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/firmware`,
    CREATE_DEVICE_FIRMWARE: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/firmware`,
    UPDATE_DEVICE_FIRMWARE: (
      oemId: string,
      deviceModelId: string,
      firmwareId: string
    ) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/firmware/${firmwareId}`,

    GET_ALL_DID: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/provision-devices`,
    REQUEST_PRODUCTION_DEVICE_MODEL: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/production`,
    CREATE_ENGINEERING_DID: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/provision-devices`
  },
  PRODUCTION: {
    GET_ALL_DEVICE_MODELS: (oemId: string, params: string) =>
      `zeus/v2/oems/${oemId}/device-models${params}`,
    UPDATE_DEVICE_MODELS: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/device-models/${deviceModelId}`,
    CREATE_DEVICE_MODEL: (oemId: string) =>
      `zeus/v2/oems/${oemId}/device-models`,
    GET_DEVICE_MODEL: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/device-models/${deviceModelId}`, // Api needs to be changed
    GET_DEVICE_FIRMWARES: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/device-models/${deviceModelId}/firmware`,
    CREATE_DEVICE_FIRMWARE: (oemId: string, deviceModelId: string) =>
      `zeus/v2/oems/${oemId}/device-models/${deviceModelId}/firmware`,
    UPDATE_DEVICE_FIRMWARE: (
      oemId: string,
      deviceModelId: string,
      firmwareId: string
    ) =>
      `zeus/v2/oems/${oemId}/device-models/${deviceModelId}/firmwares/${firmwareId}`
    // GET_ALL_DID: (oemId: string, deviceModelId: string) =>
    //   `https://f834787f-92b1-41aa-9610-b1de4d1b1732.mock.pstmn.io/zeus/getAllDeviceDids`
  },
  GET_PRESIGNED_URLS: (oemId: string, deviceModelId: string) =>
    `zeus/v2/oems/${oemId}/device-models/${deviceModelId}/presigned-upload-url`,
  REQUEST_FIRMWARE_FOR_REVIEW: (
    oemId: string,
    deviceModelId: string,
    firmwareId: string
  ) =>
    `zeus/v2/oems/${oemId}/device-models/${deviceModelId}/firmware/${firmwareId}`,
  WITHDRAW_FIRMWARE: (
    oemId: string,
    deviceModelId: string,
    firmwareId: string
  ) =>
    `zeus/v2/oems/${oemId}/device-models/${deviceModelId}/firmware/${firmwareId}`,
  FORCE_OTA_UPDATE: (oemId: string, deviceModelId: string) =>
    `zeus/v2/oems/${oemId}/eng-device-models/${deviceModelId}/trigger-forced-ota`
};

export const ATLAS_ENDPOINTS = {
  SUBSCRIPTION_URL: '/atlas/subscriptions',
  GET_USER: 'atlas/users',
  GET_ALL_SPACES: 'atlas/spaces',
  GET_ALL_DEVICES_BY_SPACE_ID: (spaceId: string) =>
    `atlas/spaces/${spaceId}/devices`
};
