import {
  SubscriptionType,
  SubscriptionBuyType,
  TrialResponse
} from 'types/response/piggybank/subscriptionTypes';
import { IPaymentMethods } from 'types/response/piggybank/paymentTypes';
import { Plans } from 'types/response/piggybank/planTypes';
import { ISetupIntent } from 'types/request/piggybank/paymentTypes';
import { UpgradPayload } from 'types/request/piggybank/subscriptionTypes';
import { partnerPortalApi } from './axios';
import { PIGGYBANK_ENDPOINTS, ATLAS_ENDPOINTS } from '../../constants/api';
import { ApiResponse } from './HttpRequest';

// Payment API functions

export async function getPaymentMethods(): Promise<
  ApiResponse<IPaymentMethods>
> {
  const response = await partnerPortalApi.get(
    PIGGYBANK_ENDPOINTS.PAYMENT_METHODS_URL
  );
  return response;
}

export async function paymentSetupIntent(): Promise<ApiResponse<ISetupIntent>> {
  const response = await partnerPortalApi.post(
    PIGGYBANK_ENDPOINTS.SETUP_INTENT_URL
  );
  return response;
}

// Plan Details API functions
export async function GetPlanDetails(): Promise<ApiResponse<Plans[]>> {
  const response = await partnerPortalApi.get(PIGGYBANK_ENDPOINTS.PLANS_URL);
  return response;
}

// Subscription details

export async function getSubscriptionDetails(): Promise<
  ApiResponse<SubscriptionType[]>
> {
  const response = await partnerPortalApi.get(ATLAS_ENDPOINTS.SUBSCRIPTION_URL);
  return response;
}

export async function upgradeUserSubscription(
  payload: UpgradPayload
): Promise<ApiResponse<SubscriptionBuyType>> {
  const response = await partnerPortalApi.post(
    PIGGYBANK_ENDPOINTS.SUBSCRIPTION_UPGRADE_URL,
    payload
  );
  return response;
}

export async function buyUserSubscription(
  payload: UpgradPayload
): Promise<ApiResponse<SubscriptionBuyType>> {
  const response = await partnerPortalApi.post(
    PIGGYBANK_ENDPOINTS.SUBSCRIPTION_BUY_URL,
    payload
  );
  return response;
}

export async function checkFreeTrialSubscription(): Promise<
  ApiResponse<TrialResponse>
> {
  const response = await partnerPortalApi.get(
    PIGGYBANK_ENDPOINTS.CHECK_TRIAL_URL
  );
  return response;
}
