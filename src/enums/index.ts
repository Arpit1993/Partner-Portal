export enum FLOW {
  ENGINEERING = 'engineering',
  PRODUCTION = 'production'
}

export enum ADD_CAMERA_MODEL_STEPS {
  STEP_ONE = 'step_one',
  STEP_TWO = 'step_two'
}

export enum DEVICE_MODEL_STATUS {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  REVIEW = 'Review',
  REJECTED = 'Rejected'
}

export enum PRODUCTION_DEVICE_MODEL_STATUS {
  PUBLISHED = 'Published',
  WAITING_FOR_FIRMWARE = 'WaitForFirmware'
}

export enum USER_ROLES {
  OEM_ADMIN = 'Admin',
  OEM_VIEWER = 'Viewer',
  OEM_SUPER_ADMIN = 'SuperAdmin'
}

export enum UI_USER_ROLES {
  OEM_ADMIN = 'Admin',
  OEM_VIEWER = 'Viewer',
  OEM_SUPER_ADMIN = 'Super Admin'
}

export enum FIRMWARE_STATUS {
  DRAFT = 'Draft',
  REVIEW = 'Review',
  ALPHA = 'Alpha',
  BETA = 'Beta',
  RELEASED = 'Released',
  WITHDRAW = 'Withdraw',
  ARCHIVED = 'Archived',
  LATEST = 'Latest',
  REJECTED = 'Rejected'
}

export enum UI_FIRMWARE_STATUS {
  DRAFT = 'Draft',
  REVIEW = 'Review',
  ALPHA = 'Under QA',
  BETA = 'Beta Testing',
  RELEASED = 'Released',
  WITHDRAW = 'Withdraw',
  ARCHIVED = 'Archived',
  LATEST = 'Latest',
  REJECTED = 'Rejected'
}

export enum PRODUCT_TYPES {
  HOME_SECURITY = 'HomeSecurity',
  BABY = 'Baby'
}

export enum FORCE_OTA_TYPE {
  SINGLE = 'Single',
  ALL = 'All'
}

export enum DEVICE_STATUS {
  OFFLINE = 'Offline',
  ONLINE = 'Online'
}

export enum FIRMWARE_TAGS {
  LATEST = 'Latest'
}
