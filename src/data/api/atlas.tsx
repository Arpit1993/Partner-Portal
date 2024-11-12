import { SpaceResponseType } from 'types/response/atlas/spaceTypes';
import { SubscriptionType } from 'types/response/piggybank/subscriptionTypes';
import { partnerPortalApi } from './axios';
import { ATLAS_ENDPOINTS } from '../../constants/api';
import { ApiResponse } from './HttpRequest';

export async function getAllSpaces(): Promise<
  ApiResponse<SpaceResponseType[]>
> {
  const response = await partnerPortalApi.get(ATLAS_ENDPOINTS.GET_ALL_SPACES);
  console.log('GetAllSpaces', response);
  return response;
}

export async function getSubscriptionDetails(): Promise<
  ApiResponse<SubscriptionType[]>
> {
  const response = await partnerPortalApi.get(ATLAS_ENDPOINTS.SUBSCRIPTION_URL);
  return response;
}
