import styled from '@emotion/styled';
import DeviceManageDID from 'components/DeviceManageDID/DeviceManageDID';
import DeviceManageFirmware from 'components/DeviceManageFirmware/DeviceManageFirmware';
import DeviceTitle from 'components/DeviceTitle/DeviceTitle';
import {
  getAllEngineeringDeviceDid,
  // getAllProductionDeviceDid,
  getEngineeringDeviceFirmwares,
  getEngineeringDeviceModel,
  getProductionDeviceFirmwares,
  getProductionDeviceModel
} from 'data/api/zeus';
import { FIRMWARE_STATUS } from 'enums';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IOemModelResponse } from 'types/response/zeus/deviceTypes';
import {
  IDeviceFirmwareResponse,
  IDIDResponse
} from 'types/response/zeus/firmwareTypes';
import { getOemAndUserId, isEngineering } from 'utils';

const MainContainer = styled('main')`
  display: flex;
`;

const DeviceDetailsContainer = styled('section')`
  flex-grow: 1;
  padding: 16px;
`;

function DeviceManageFirmwareAndDID() {
  const [firmwareList, setFirmwareList] = useState<IDeviceFirmwareResponse[]>(
    []
  );
  const [isLoadingFirmwareList, setIsLoadingFirmwareList] = useState(false);
  const [didList, setDidList] = useState<IDIDResponse[]>([]);
  const [isLoadingDidList, setIsLoadingDidList] = useState(false);
  const [modelName, setModelName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [productType, setProductType] = useState('');
  const [deviceModelInformation, setDeviceModelInformation] =
    useState<IOemModelResponse>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingDeviceInformation, setIsLoadingDeviceInformation] =
    useState(false);
  const [reviewFirmwareStatus, setReviewFirmwareStatus] = useState<string>('');
  const [reviewFirmwareVersion, setReviewFirmwareVersion] =
    useState<string>('');
  const { deviceId } = useParams();
  const { oem_id } = getOemAndUserId();
  const isEngineeringFlow = isEngineering();
  const oemId: string = oem_id || '';
  const deviceModelId: string = deviceId || '';
  const fetchDeviceDetailApi = isEngineeringFlow
    ? getEngineeringDeviceModel
    : getProductionDeviceModel;

  const firmwareApiToCall = isEngineeringFlow
    ? getEngineeringDeviceFirmwares
    : getProductionDeviceFirmwares;

  const didsToFetchForADevice = getAllEngineeringDeviceDid;

  const findFirmwareInRevieworAlpha = (
    devicefirmwareList: IDeviceFirmwareResponse[]
  ) => {
    const firmwareInReviewOrAlpha = devicefirmwareList.find(
      (firmware: IDeviceFirmwareResponse) =>
        firmware?.status === FIRMWARE_STATUS.REVIEW ||
        firmware?.status === FIRMWARE_STATUS.ALPHA
    );

    if (firmwareInReviewOrAlpha) {
      setReviewFirmwareStatus(firmwareInReviewOrAlpha.status);
      setReviewFirmwareVersion(firmwareInReviewOrAlpha.firmware_version);
    } else {
      setReviewFirmwareStatus('');
      setReviewFirmwareVersion('');
    }
  };
  const fetchDeviceFirmwareAndDids = async () => {
    setIsLoadingFirmwareList(true);
    setIsLoadingDidList(true);
    try {
      const [firmwareResponse, didResponse] = await Promise.all([
        firmwareApiToCall(oemId, deviceModelId),
        didsToFetchForADevice(oemId, deviceModelId)
      ]);

      setFirmwareList(firmwareResponse?.device_firmware);
      setDidList(didResponse?.items);

      findFirmwareInRevieworAlpha(firmwareResponse?.device_firmware);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setIsLoadingFirmwareList(false);
      setIsLoadingDidList(false);
    }
  };

  const fetchDeviceDetails = async () => {
    setIsLoadingDeviceInformation(true);
    try {
      const deviceModelInfo = await fetchDeviceDetailApi(oemId, deviceModelId);
      setModelName(deviceModelInfo?.model_name || '');
      setProductType(deviceModelInfo?.product_type);
      if (deviceModelInfo?.photo_urls?.length) {
        setPhotoURL(deviceModelInfo?.photo_urls[0]);
      }
      setDeviceModelInformation(deviceModelInfo);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setIsLoadingDeviceInformation(false);
    }
  };

  const fetchAllDids = async () => {
    setIsLoadingDidList(true);
    try {
      const allDids = await getAllEngineeringDeviceDid(oemId, deviceModelId);
      setDidList(allDids?.items);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setIsLoadingDidList(false);
    }
  };

  const fetchAllFirmware = async () => {
    setIsLoadingFirmwareList(true);
    try {
      const allFirmwares = await firmwareApiToCall(oemId, deviceModelId);
      setFirmwareList(allFirmwares?.device_firmware);
    } catch (error) {
      console.log('Error fetching firmwares: ', error);
    } finally {
      setIsLoadingFirmwareList(false);
    }
  };

  useEffect(() => {
    findFirmwareInRevieworAlpha(firmwareList);
  }, [firmwareList]);

  useEffect(() => {
    fetchDeviceFirmwareAndDids();
    fetchDeviceDetails();
  }, []);

  return (
    <MainContainer>
      <DeviceDetailsContainer>
        <DeviceTitle modelName={modelName} photoURL={photoURL} />

        {deviceModelInformation && (
          <DeviceManageFirmware
            deviceModelId={deviceModelId}
            oemId={oem_id}
            firmwareList={firmwareList}
            didList={didList}
            isLoadingFirmwareList={isLoadingFirmwareList}
            reloadFirmwareList={fetchAllFirmware}
            deviceModelInformation={deviceModelInformation}
            productType={productType}
            reviewFirmwareStatus={reviewFirmwareStatus}
            reviewFirmwareVersion={reviewFirmwareVersion}
          />
        )}

        {isEngineeringFlow && (
          <DeviceManageDID
            deviceModelId={deviceModelId}
            oemId={oem_id}
            didList={didList}
            isLoadingDidList={isLoadingDidList}
            reloadDIDList={fetchAllDids}
            productType={productType}
            firmwareList={firmwareList}
          />
        )}
      </DeviceDetailsContainer>
    </MainContainer>
  );
}

export default DeviceManageFirmwareAndDID;
