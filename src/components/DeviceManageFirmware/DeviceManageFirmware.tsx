/* eslint-disable react/jsx-no-useless-fragment */
import CardWithDivider from 'core-components/CardWithDivider';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import InstaPopper from 'core-components/Popper';
import CircularProgress from '@mui/material/CircularProgress';
import {
  IDIDResponse,
  IDeviceFirmwareResponse
} from 'types/response/zeus/firmwareTypes';
// import DeleteFirmwareIcon from 'assets/firmware/deletefirmware.svg';
// import EnableForceUpdatesIcon from 'assets/firmware/enableforceupdates.svg';
import MakeCurrentIcon from 'assets/firmware/makecurrent.svg';
import UpdateSpecificDidsIcon from 'assets/firmware/updatespecificdids.svg';
import { useState } from 'react';
// import Button from 'core-components/Button';
import UploadFirmware from 'components/UploadFirmware';
import {
  requestToReviewFirmware,
  updateEngineeringDeviceFirmwares,
  withdrawFirmware,
  updateFirmwareForDids
} from 'data/api/zeus';
import {
  convertTimestampToTimeAndDate,
  isEngineering,
  returnProdFirmwareStatus
} from 'utils';
import RequestToReviewFirmware from 'components/RequestToReview';
import {
  FIRMWARE_STATUS,
  FORCE_OTA_TYPE,
  PRODUCT_TYPES,
  FIRMWARE_TAGS
} from 'enums';
import { IOemModelResponse } from 'types/response/zeus/deviceTypes';
import WithdrawFirmware from 'components/WithdrawFirmware';
import { IFirmwareForceOTARequestPayload } from 'types/request/zeus/firmwareTypes';
import CheckForReviewFirmware from 'components/CheckForReviewFirmware/CheckForReviewFirmware';
import MakeCurrent from '../MakeCurrent';
// import DeleteFirmware from '../DeleteFirmware';
// import EnableForcedUpdate from '../EnableForcedUpdate';
import UpdateSpecificDid from '../UpdateSpecificDid';

const TableHeaderContainer = styled(MuiCard)`
  margin-bottom: 12px;
`;

const Header = styled('header')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const DisplayText = styled('section')`
  display: flex;
  justify-content: space-evenly;
  text-align: left;
  padding: 20px 20px;
`;

const Item = styled(Typography)`
  text-align: left;
  margin-left: 12px;
`;

const HeaderItem = styled(Typography)`
  text-align: left;
  font-weight: 600;
`;

const DeviceManageFirmwareDetails = styled(CardWithDivider)`
  max-height: 240px;
  overflow-y: auto;

  /* Custom scrollbar styles for WebKit-based browsers */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* Color when hovering over the thumb */
  }

  /* Custom scrollbar styles for Firefox */
  scrollbar-width: thin;
  scrollbar-color: #f1f1f1;
`;

const PopperContentWrapper = styled.div`
  display: flex;
  align-content: center;
  margin: 8px 8px 8px 0px;
  &:hover {
    color: #000000;
  }
`;

const ManageFirmwareTextUploadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LoaderWrapper = styled.div``;

interface DeviceManageFirmwareProps {
  oemId: string;
  deviceModelId: string;
  firmwareList: IDeviceFirmwareResponse[];
  isLoadingFirmwareList: boolean;
  didList: IDIDResponse[];
  reloadFirmwareList: () => void;
  deviceModelInformation: IOemModelResponse;
  productType: string;
  reviewFirmwareStatus: string;
  reviewFirmwareVersion: string;
}

const isLatest = (fw: IDeviceFirmwareResponse) => {
  return Array.isArray(fw?.tags) && fw?.tags.includes(FIRMWARE_TAGS.LATEST);
};

function DeviceManageFirmware(props: DeviceManageFirmwareProps) {
  const {
    oemId,
    deviceModelId,
    firmwareList,
    isLoadingFirmwareList,
    didList,
    reloadFirmwareList,
    deviceModelInformation,
    productType,
    reviewFirmwareStatus,
    reviewFirmwareVersion
  } = props;

  const [openMakeCurrentModal, setOpenMakeCurrentModal] = useState(false);
  // const [openDeleteFirmwareModal, setOpenDeleteFirmwareModal] = useState(false);
  // const [openEnableForcedUpdateModal, setEnableForcedUpdateModal] =
  //   useState(false);
  const [openUpdateSpecificDidModal, setOpenUpdateSpecificDidModal] =
    useState(false);
  const [openRequestToReviewModal, setOpenRequestToReviewModal] =
    useState(false);
  const [openWithdrawFirmwareModal, setOpenWithdrawFirmwareModal] =
    useState(false);
  const [isMakingCurrentLoading, setIsMakingCurrentLoading] = useState(false);
  // const [isDeletingFirmwareLoading, setIsDeletingFirmwareLoading] =
  //   useState(false);
  // const [isEnableForceUpdateLoading, setIsEnableForceUpdateLoading] =
  //   useState(false);
  const [isUpdateSpecificDidLoading, setIsUpdateSpecificDidLoading] =
    useState(false);

  const [isRequestToReviewLoading, setIsRequestToReviewLoading] =
    useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [selectedFirmware, setSelectedFirmware] = useState('');
  const [selectedFirmwareId, setSelectedFirmwareId] = useState('');
  const [selectedFirmwareInfo, setSelectedFirmwareInfo] =
    useState<IDeviceFirmwareResponse | null>(null);
  const [didListForOta, setDidListForOta] = useState<string>('');

  const [openFimrwareReviewCheckModal, setOpenFirmwareReviewCheckModal] =
    useState(false);

  const handleCloseFimrwareReviewCheckModal = () => {
    setOpenFirmwareReviewCheckModal(false);
  };

  const isEngineeringFlow = isEngineering();
  // console.log('selectedFirmware:: ', selectedFirmware);
  const handleMakeCurrentModalClose = () => {
    setOpenMakeCurrentModal(false);
  };

  const handleMakeCurrentButtonClick = async (firmwareId: string) => {
    setIsMakingCurrentLoading(true);
    try {
      const payload = {
        status: 'Released'
      };
      await updateEngineeringDeviceFirmwares(
        oemId,
        deviceModelId,
        firmwareId,
        payload
      );
      await reloadFirmwareList();
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsMakingCurrentLoading(false);
      setOpenMakeCurrentModal(false);
    }
  };

  const handleMakeCurrentPopperButtonClick = (
    firmwareVersion: string,
    firmwareId: string
  ) => {
    setSelectedFirmwareId(firmwareId);
    setSelectedFirmware(firmwareVersion);
    setOpenMakeCurrentModal(true);
  };

  // const handleDeleteFirmwareModalClose = () => {
  //   setOpenDeleteFirmwareModal(false);
  // };

  // const handleDeleteFirmwareButtonClick = () => {
  //   setIsDeletingFirmwareLoading(true);
  //   try {
  //     // Do Something
  //   } catch (error) {
  //     console.log('error', error);
  //   } finally {
  //     setIsDeletingFirmwareLoading(false);
  //   }
  // };

  // const handleDeleteFirmwarePopperButtonClick = (firmwareVersion: string) => {
  //   setSelectedFirmware(firmwareVersion);
  //   setOpenDeleteFirmwareModal(true);
  // };

  // const handleEnableForcedUpdateModalClose = () => {
  //   setEnableForcedUpdateModal(false);
  // };

  // const handleEnableForcedUpdateButtonClick = () => {
  //   setIsEnableForceUpdateLoading(true);
  //   try {
  //     // Do Something
  //   } catch (error) {
  //     console.log('error', error);
  //   } finally {
  //     setIsEnableForceUpdateLoading(false);
  //   }
  // };

  // const handleEnableForcedUpdateePopperButtonClick = (
  //   firmwareVersion: string
  // ) => {
  //   setSelectedFirmware(firmwareVersion);
  //   setEnableForcedUpdateModal(true);
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handleEnableForcedFieldChange = (event: { target: { value: any } }) => {
  //   console.log('On Change triggered:: ', event.target.value);
  // };

  const handleUpdateSpecificDidModalClose = () => {
    setOpenUpdateSpecificDidModal(false);
  };

  const handleRequestToReviewOpen = () => {
    if (reviewFirmwareVersion) {
      setOpenFirmwareReviewCheckModal(true);
    } else {
      console.log('open Request Modal');
      setOpenRequestToReviewModal(true);
    }
  };

  const handleRequestToReviewClose = () => {
    setOpenRequestToReviewModal(false);
  };

  const handleWithdrawClose = () => {
    setOpenWithdrawFirmwareModal(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateSpecificDidButtonClick = async (event: any) => {
    setIsUpdateSpecificDidLoading(true);
    try {
      // Do Something
      console.log('Logging Event: ', event);
      const payload: IFirmwareForceOTARequestPayload = {
        device_id: didListForOta,
        region: ['USA'],
        firmware_id: selectedFirmwareId,
        type:
          didListForOta === 'all' ? FORCE_OTA_TYPE.ALL : FORCE_OTA_TYPE.SINGLE
      };
      console.log('Selected Firmware::: ', selectedFirmwareId);
      const response = await updateFirmwareForDids(
        oemId,
        deviceModelId,
        payload
      );
      console.log('response: ', response);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsUpdateSpecificDidLoading(false);
      setOpenUpdateSpecificDidModal(false);
    }
  };

  const handleRequestToReviewButtonClick = async () => {
    setIsRequestToReviewLoading(true);
    try {
      const payload = {
        file_location: selectedFirmwareInfo?.file_location || '',
        firmware_version: selectedFirmwareInfo?.firmware_version || '',
        status: FIRMWARE_STATUS.REVIEW,
        md5: selectedFirmwareInfo?.md5_checksum || '',
        tag: selectedFirmwareInfo?.note || ''
      };
      const response = await requestToReviewFirmware(
        oemId,
        deviceModelId,
        selectedFirmwareId,
        payload
      );
      console.log('response: ', response);
      await reloadFirmwareList();
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsRequestToReviewLoading(false);
      setOpenRequestToReviewModal(false);
    }
  };

  const handleUpdateSpecificDidPopperButtonClick = (
    firmwareVersion: string,
    firmwareId: string
  ) => {
    setSelectedFirmware(firmwareVersion);
    setSelectedFirmwareId(firmwareId);
    setOpenUpdateSpecificDidModal(true);
  };

  const handleRequestToReviewPopperButtonClick = (
    item: IDeviceFirmwareResponse
  ) => {
    if (reviewFirmwareVersion) {
      handleRequestToReviewOpen();
    } else {
      setSelectedFirmware(item.firmware_version);
      setSelectedFirmwareId(item.id);
      setSelectedFirmwareInfo(item);
      setOpenRequestToReviewModal(true);
    }
  };

  const handleUpdateSpecificDidFieldChange = (event: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: { value: any };
  }) => {
    console.log('On Change triggered:: ', event.target.value);
    setDidListForOta(event.target.value);
  };

  const handleWithdrawPopperButtonClick = (item: IDeviceFirmwareResponse) => {
    setSelectedFirmware(item.firmware_version);
    setSelectedFirmwareId(item.id);
    setSelectedFirmwareInfo(item);
    setOpenWithdrawFirmwareModal(true);
  };

  const handleWithdrawButtonClick = async () => {
    setIsWithdrawLoading(true);
    try {
      const payload = {
        file_location: selectedFirmwareInfo?.file_location || '',
        firmware_version: selectedFirmwareInfo?.firmware_version || '',
        status: FIRMWARE_STATUS.WITHDRAW,
        md5: selectedFirmwareInfo?.md5_checksum || '',
        tag: selectedFirmwareInfo?.note || ''
      };
      const response = await withdrawFirmware(
        oemId,
        deviceModelId,
        selectedFirmwareId,
        payload
      );
      console.log('response: ', response);
      await reloadFirmwareList();
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsWithdrawLoading(false);
      setOpenWithdrawFirmwareModal(false);
    }
  };

  return (
    <div style={{ margin: '40px 0px' }}>
      <Header>
        <ManageFirmwareTextUploadContainer>
          <Typography variant="h3" sx={{ fontWeight: '500', flex: 2 }}>
            MANAGE FIRMWARE
          </Typography>
          {/* <Button label="Upload">Upload </Button> */}
          <UploadFirmware
            deviceModelId={deviceModelId}
            reloadFirmwareList={reloadFirmwareList}
            deviceModelInformation={deviceModelInformation}
          />
        </ManageFirmwareTextUploadContainer>
      </Header>
      <TableHeaderContainer variant="instavisionCardWithBorder">
        <DisplayText>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Version
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Status
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Note
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Date
          </HeaderItem>
        </DisplayText>
      </TableHeaderContainer>

      {/* When list is loading */}
      {isLoadingFirmwareList && (
        <MuiCard
          variant="instavisionCardWithBorder"
          style={{ padding: '40px 0px', textAlign: 'center' }}
        >
          <LoaderWrapper>
            <CircularProgress color="inherit" />
          </LoaderWrapper>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', fontWeight: '500' }}
          >
            Loading
          </Typography>
        </MuiCard>
      )}

      {/* When List is empty */}
      {!isLoadingFirmwareList && (
        <>
          {!firmwareList || firmwareList?.length === 0 ? (
            <MuiCard variant="instavisionCardWithBorder">
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  margin: '80px 0px',
                  fontWeight: '500'
                }}
              >
                No Firmware Available for this Device.
              </Typography>
            </MuiCard>
          ) : (
            // When list have data
            <DeviceManageFirmwareDetails sx={{ maxHeight: '484px' }}>
              {firmwareList.map((item: IDeviceFirmwareResponse) => {
                // console.log('firmwareList => item', item);
                return (
                  <DisplayText key={item?.id}>
                    <Item variant="body2" style={{ flex: 1 }}>
                      <span style={{ fontWeight: '500' }}>
                        {item.firmware_version}
                      </span>
                    </Item>
                    <Item style={{ flex: 1 }}>
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: '16px',
                          width: '120px',
                          textAlign: 'center',
                          padding: '8px 0px'
                        }}
                      >
                        <Typography variant="body2" color="primary.main">
                          <span>
                            {isLatest(item)
                              ? returnProdFirmwareStatus(FIRMWARE_TAGS.LATEST)
                              : returnProdFirmwareStatus(item.status)}
                          </span>
                          {isLatest(item) ? (
                            <Badge
                              color="success"
                              variant="dot"
                              style={{ marginLeft: '8px' }}
                            />
                          ) : null}
                        </Typography>
                      </div>
                    </Item>
                    <Item sx={{ flex: 1 }}>
                      <Item
                        variant="body2"
                        style={{ fontWeight: '400', color: '#333' }}
                      >
                        {item?.note}
                      </Item>
                    </Item>
                    <Item sx={{ flex: 1 }}>
                      {(() => {
                        const { timeOnly, dateOnly } =
                          convertTimestampToTimeAndDate(item?.created_at);
                        return (
                          <>
                            <Item
                              variant="body2"
                              style={{ fontWeight: '500', color: '#333' }}
                            >
                              {timeOnly}
                            </Item>
                            <Item
                              variant="body2"
                              style={{ fontWeight: '400', color: '#333' }}
                            >
                              {dateOnly}
                            </Item>
                          </>
                        );
                      })()}
                    </Item>
                    <Item>
                      <InstaPopper
                        sx={{ margin: '16px' }}
                        disablePopperProp={
                          isEngineeringFlow
                            ? productType === PRODUCT_TYPES.BABY &&
                              isLatest(item)
                            : item?.status === FIRMWARE_STATUS.RELEASED ||
                              item?.status === FIRMWARE_STATUS.REJECTED
                        }
                      >
                        {isEngineeringFlow && !isLatest(item) && (
                          <PopperContentWrapper
                            style={{
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onClick={() =>
                              handleMakeCurrentPopperButtonClick(
                                item?.firmware_version,
                                item?.id
                              )
                            }
                          >
                            <img
                              src={MakeCurrentIcon}
                              alt="Make Latest"
                              style={{ marginBottom: '4px' }}
                            />
                            <p style={{ margin: '0px 0px 0px 16px' }}>
                              Make Latest
                            </p>
                          </PopperContentWrapper>
                        )}
                        {/* <PopperContentWrapper
                          style={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() =>
                            handleDeleteFirmwarePopperButtonClick(
                              item.firmware_version
                            )
                          }
                        >
                          <img
                            src={DeleteFirmwareIcon}
                            alt="Delete Firmware"
                            style={{ marginBottom: '4px' }}
                          />
                          <p style={{ margin: '0px 0px 0px 16px' }}>
                            Delete Firmware
                          </p>
                        </PopperContentWrapper> */}
                        {/* <PopperContentWrapper
                          style={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() =>
                            handleEnableForcedUpdateePopperButtonClick(
                              item.firmware_version
                            )
                          }
                        >
                          <img
                            src={EnableForceUpdatesIcon}
                            alt="Enable force updates"
                            style={{ marginBottom: '4px' }}
                          />
                          <p style={{ margin: '0px 0px 0px 16px' }}>
                            Enable force updates
                          </p>
                        </PopperContentWrapper> */}
                        {isEngineeringFlow &&
                          productType !== PRODUCT_TYPES.BABY &&
                          item?.status === FIRMWARE_STATUS.RELEASED && (
                            <PopperContentWrapper
                              style={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onClick={() =>
                                handleUpdateSpecificDidPopperButtonClick(
                                  item?.firmware_version,
                                  item?.id
                                )
                              }
                            >
                              <img
                                src={UpdateSpecificDidsIcon}
                                alt="Update specific dids"
                                style={{ marginBottom: '4px' }}
                              />
                              <p style={{ margin: '0px 0px 0px 16px' }}>
                                Update specific DID`s
                              </p>
                            </PopperContentWrapper>
                          )}
                        {!isEngineeringFlow &&
                          (item?.status === FIRMWARE_STATUS.DRAFT ||
                            item?.status === FIRMWARE_STATUS.WITHDRAW) && (
                            <PopperContentWrapper
                              style={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onClick={() =>
                                handleRequestToReviewPopperButtonClick(item)
                              }
                            >
                              <img
                                src={UpdateSpecificDidsIcon}
                                alt="Request to Review"
                                style={{ marginBottom: '4px' }}
                              />
                              <p style={{ margin: '0px 0px 0px 16px' }}>
                                Request to Review
                              </p>
                            </PopperContentWrapper>
                          )}
                        {!isEngineeringFlow &&
                          (item?.status === FIRMWARE_STATUS.REVIEW ||
                            item?.status === FIRMWARE_STATUS.ALPHA) && (
                            <PopperContentWrapper
                              style={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onClick={() =>
                                handleWithdrawPopperButtonClick(item)
                              }
                            >
                              <img
                                src={UpdateSpecificDidsIcon}
                                alt="Withdraw"
                                style={{ marginBottom: '4px' }}
                              />
                              <p style={{ margin: '0px 0px 0px 16px' }}>
                                Withdraw
                              </p>
                            </PopperContentWrapper>
                          )}
                      </InstaPopper>
                    </Item>
                  </DisplayText>
                );
              })}
            </DeviceManageFirmwareDetails>
          )}
        </>
      )}

      <MakeCurrent
        openMakeCurrentModal={openMakeCurrentModal}
        handleMakeCurrentModalClose={handleMakeCurrentModalClose}
        handleMakeCurrentButtonClick={handleMakeCurrentButtonClick}
        selectedFirmware={selectedFirmware}
        selectedFirmwareId={selectedFirmwareId}
        isMakingCurrentLoading={isMakingCurrentLoading}
        reloadDIDList={reloadFirmwareList}
      />

      {/* <DeleteFirmware
        openDeleteFirmwareModal={openDeleteFirmwareModal}
        handleDeleteFirmwareModalClose={handleDeleteFirmwareModalClose}
        handleDeleteFirmwareButtonClick={handleDeleteFirmwareButtonClick}
        selectedFirmware={selectedFirmware}
        isDeletingFirmwareLoading={isDeletingFirmwareLoading}
      />
      <EnableForcedUpdate
        openEnableForcedUpdateModal={openEnableForcedUpdateModal}
        handleEnableForcedUpdateModalClose={handleEnableForcedUpdateModalClose}
        handleEnableForcedUpdateButtonClick={
          handleEnableForcedUpdateButtonClick
        }
        didList={didList}
        handleEnableForcedFieldChange={handleEnableForcedFieldChange}
        isEnableForcedUpdateLoading={isEnableForceUpdateLoading}
      /> */}
      <UpdateSpecificDid
        handleUpdateSpecificDidModalClose={handleUpdateSpecificDidModalClose}
        handleUpdateSpecificDidButtonClick={handleUpdateSpecificDidButtonClick}
        didList={didList}
        handleUpdateSpecificDidFieldChange={handleUpdateSpecificDidFieldChange}
        openUpdateSpecificDidModal={openUpdateSpecificDidModal}
        isUpdateSpecificDidLoading={isUpdateSpecificDidLoading}
        didListForOta={didListForOta}
      />

      <RequestToReviewFirmware
        selectedFirmware={selectedFirmware}
        openRequestToReviewModal={openRequestToReviewModal}
        handleRequestToReviewClose={handleRequestToReviewClose}
        handleRequestToReviewButtonClick={handleRequestToReviewButtonClick}
        isRequestToReviewLoading={isRequestToReviewLoading}
      />

      <WithdrawFirmware
        selectedFirmware={selectedFirmware}
        openWithdrawFirmwareModal={openWithdrawFirmwareModal}
        handleWithdrawButtonClick={handleWithdrawButtonClick}
        handleWithdrawClose={handleWithdrawClose}
        isWithdrawLoading={isWithdrawLoading}
      />

      <CheckForReviewFirmware
        openFimrwareReviewCheckModal={openFimrwareReviewCheckModal}
        handleCloseFimrwareReviewCheckModal={
          handleCloseFimrwareReviewCheckModal
        }
        reviewFirmwareStatus={reviewFirmwareStatus}
        reviewFirmwareVersion={reviewFirmwareVersion}
      />
    </div>
  );
}

export default DeviceManageFirmware;
