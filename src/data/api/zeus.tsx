/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IAddOEMUserResponse,
  IEditOEMUserResponse,
  TLoginUserResponse
} from 'types/response/zeus/userTypes';
import { AxiosError } from 'axios';
import { ZEUS_ENDPOINTS } from 'constants/api';
import {
  IAddOEMUserRequest,
  IEditOEMUserRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest
} from 'types/request/zeus/userTypes';
import {
  ICreateDeviceModelRequest
  // IEditDeviceModelRequest
} from 'types/request/zeus/deviceTypes';
import {
  ICreateDeviceModelResponse,
  IEditDeviceModelResponse,
  IOemModelListResponse,
  IOemModelResponse
} from 'types/response/zeus/deviceTypes';
import {
  IDIDListResponse,
  IGetPreSignedUrlResponse,
  // ICreateFirmwareReleaseResponse,
  IDeviceFirmwareListResponse,
  IUpdatedeviceFirmwareInfoResponse,
  IUploadFirmwareResponse
} from 'types/response/zeus/firmwareTypes';
import {
  IFirmwareForceOTARequestPayload,
  IFirmwareReviewRequestPayload,
  // ICreateFirmwareReleaseRequest,
  IUpdateDeviceFirmwareStatusRequest,
  IUploadFirmwareRequest
} from 'types/request/zeus/firmwareTypes';
import { partnerPortalApi } from './axios';

export async function forgotPasswordRequest(payload: IForgotPasswordRequest) {
  try {
    const response = await partnerPortalApi.post(
      ZEUS_ENDPOINTS.FORGOT_PASSWORD_URL,
      payload
    );
    return response;
  } catch (err) {
    return (err as AxiosError).response;
  }
}

export async function resetPasswordRequest(payload: IResetPasswordRequest) {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.RESET_PASSWORD_URL,
    payload
  );
  return response;
}

export async function loginUser(
  email: string,
  password: string
): Promise<TLoginUserResponse> {
  const response = await partnerPortalApi.post(ZEUS_ENDPOINTS.USER_LOGIN_URL, {
    email,
    password,
    grant_type: 'password'
  });
  return response.data;
}

export async function getOemDetails(userId: string) {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.OEM_DETAILS(userId)
  );
  return response.data;
}

export async function getOemUsers(oemId: string) {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.GET_OEM_USERS(oemId)
  );
  return response.data;
}

export async function addOemUser(
  oemId: string,
  payload: IAddOEMUserRequest
): Promise<IAddOEMUserResponse> {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.ADD_OEM_USER(oemId),
    payload
  );
  return response.data;
}

export async function editOemUser(
  oemId: string,
  userId: string,
  payload: IEditOEMUserRequest
): Promise<IEditOEMUserResponse> {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.EDIT_OEM_USER(oemId, userId),
    payload
  );
  return response.data;
}

export async function removeOemUser(oemId: string, userId: string) {
  const response = await partnerPortalApi.delete(
    ZEUS_ENDPOINTS.DELETE_OEM_USER(oemId, userId)
  );
  return response;
}

export async function getEngineeringAllDeviceModel(
  oemId: string,
  params: string
): Promise<IOemModelListResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.ENGINEERING.GET_ALL_DEVICE_MODELS(oemId, params)
  );
  return response.data;
}

export async function createEngineeringDeviceModel(
  oemId: string,
  payload: ICreateDeviceModelRequest
): Promise<ICreateDeviceModelResponse> {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.ENGINEERING.CREATE_DEVICE_MODEL(oemId),
    payload
  );
  return response.data;
}

export async function updateEngineeringDeviceModel(
  oemId: string,
  deviceModelId: string,
  payload: any
): Promise<IEditDeviceModelResponse> {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.ENGINEERING.UPDATE_DEVICE_MODELS(oemId, deviceModelId),
    payload
  );
  return response.data;
}

export async function getEngineeringDeviceModel(
  oemId: string,
  deviceModelId: string
): Promise<IOemModelResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.ENGINEERING.GET_DEVICE_MODEL(oemId, deviceModelId)
  );
  return response.data;
}

export async function requestProductionDeviceModel(
  oemId: string,
  deviceModelId: string
): Promise<IOemModelResponse> {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.ENGINEERING.REQUEST_PRODUCTION_DEVICE_MODEL(
      oemId,
      deviceModelId
    )
  );
  return response.data;
}

export async function getProductionAllDeviceModel(
  oemId: string,
  param: string
): Promise<IOemModelListResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.PRODUCTION.GET_ALL_DEVICE_MODELS(oemId, param)
  );
  return response.data;
}

export async function createProductionDeviceModel(
  oemId: string,
  payload: ICreateDeviceModelRequest
): Promise<ICreateDeviceModelResponse> {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.PRODUCTION.CREATE_DEVICE_MODEL(oemId),
    payload
  );
  return response.data;
}

export async function updateProductionDeviceModel(
  oemId: string,
  deviceModelId: string,
  payload: any
): Promise<IEditDeviceModelResponse> {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.PRODUCTION.UPDATE_DEVICE_MODELS(oemId, deviceModelId),
    payload
  );
  return response.data;
}

export async function getProductionDeviceModel(
  oemId: string,
  deviceModelId: string
): Promise<IOemModelResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.PRODUCTION.GET_DEVICE_MODEL(oemId, deviceModelId)
  );
  return response.data;
}

export async function getEngineeringDeviceFirmwares(
  oemId: string,
  deviceModelId: string
): Promise<IDeviceFirmwareListResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.ENGINEERING.GET_DEVICE_FIRMWARES(oemId, deviceModelId)
  );
  return response.data;
}

export async function createEngineeringDeviceFirmwares(
  oemId: string,
  deviceModelId: string,
  payload: IUploadFirmwareRequest
): Promise<IUploadFirmwareResponse> {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.ENGINEERING.CREATE_DEVICE_FIRMWARE(oemId, deviceModelId),
    payload
  );
  return response.data;
}

export async function updateEngineeringDeviceFirmwares(
  oemId: string,
  deviceModelId: string,
  firmwareId: string,
  payload: IUpdateDeviceFirmwareStatusRequest
): Promise<IUpdatedeviceFirmwareInfoResponse> {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.ENGINEERING.UPDATE_DEVICE_FIRMWARE(
      oemId,
      deviceModelId,
      firmwareId
    ),
    payload
  );
  return response.data;
}

export async function getProductionDeviceFirmwares(
  oemId: string,
  deviceModelId: string
): Promise<IDeviceFirmwareListResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.PRODUCTION.GET_DEVICE_FIRMWARES(oemId, deviceModelId)
  );
  return response.data;
}

export async function createProductionDeviceFirmwares(
  oemId: string,
  deviceModelId: string,
  payload: IUploadFirmwareRequest
): Promise<IUploadFirmwareResponse> {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.PRODUCTION.CREATE_DEVICE_FIRMWARE(oemId, deviceModelId),
    payload
  );
  return response.data;
}

export async function updateProductionDeviceFirmwares(
  oemId: string,
  deviceModelId: string,
  firmwareId: string,
  payload: IUpdateDeviceFirmwareStatusRequest
): Promise<IUpdatedeviceFirmwareInfoResponse> {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.PRODUCTION.UPDATE_DEVICE_FIRMWARE(
      oemId,
      deviceModelId,
      firmwareId
    ),
    payload
  );
  return response.data;
}

export async function getAllEngineeringDeviceDid(
  oemId: string,
  deviceModelId: string
): Promise<IDIDListResponse> {
  const response = await partnerPortalApi.get(
    ZEUS_ENDPOINTS.ENGINEERING.GET_ALL_DID(oemId, deviceModelId)
  );
  return response.data;
}

// export async function getAllProductionDeviceDid(
//   oemId: string,
//   deviceModelId: string
// ): Promise<IDIDListResponse> {
//   const response = await partnerPortalApi.get(
//     ZEUS_ENDPOINTS.PRODUCTION.GET_ALL_DID(oemId, deviceModelId)
//   );
//   return response.data;
// }

export async function getPreSignedUrl(
  oemId: string,
  deviceModelId: string,
  fileType: string,
  fileName: string
): Promise<IGetPreSignedUrlResponse> {
  const finalUrl = `${ZEUS_ENDPOINTS.GET_PRESIGNED_URLS(
    oemId,
    deviceModelId
  )}?file-type=${fileType}&file-name=${fileName}`;
  const response = await partnerPortalApi.get(finalUrl);
  return response.data;
}

export async function getPreSignedUrlForFirmware(
  oemId: string,
  deviceModelId: string,
  fileType: string
): Promise<IGetPreSignedUrlResponse> {
  const finalUrl = `${ZEUS_ENDPOINTS.GET_PRESIGNED_URLS(
    oemId,
    deviceModelId
  )}?file-type=${fileType}`;
  const response = await partnerPortalApi.get(finalUrl);
  return response.data;
}

export async function uploadTheAssetsToAmazon(url: string, payload: any) {
  const response = await partnerPortalApi.put(url, payload, {
    headers: {
      'skip-auth': 'true', // This will instruct the interceptor to skip adding the Authorization header
      'Amz-Sdk-Request': 'attempt=1; max=3' // This headers are required for the upload to work
    }
  });
  return response;
}

export async function createEngineeringDid(
  oemId: string,
  deviceModelId: string
) {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.ENGINEERING.CREATE_ENGINEERING_DID(oemId, deviceModelId)
  );
  return response.data;
}

export async function requestToReviewFirmware(
  oemId: string,
  deviceModelId: string,
  firmwareId: string,
  payload: IFirmwareReviewRequestPayload
) {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.REQUEST_FIRMWARE_FOR_REVIEW(
      oemId,
      deviceModelId,
      firmwareId
    ),
    payload
  );
  return response.data;
}

export async function withdrawFirmware(
  oemId: string,
  deviceModelId: string,
  firmwareId: string,
  payload: IFirmwareReviewRequestPayload
) {
  const response = await partnerPortalApi.patch(
    ZEUS_ENDPOINTS.WITHDRAW_FIRMWARE(oemId, deviceModelId, firmwareId),
    payload
  );
  return response.data;
}

export async function updateFirmwareForDids(
  oemId: string,
  deviceModelId: string,
  payload: IFirmwareForceOTARequestPayload
) {
  const response = await partnerPortalApi.post(
    ZEUS_ENDPOINTS.FORCE_OTA_UPDATE(oemId, deviceModelId),
    payload
  );
  return response.data;
}
