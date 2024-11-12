import CardWithDivider from 'core-components/CardWithDivider';
import styled from '@emotion/styled';
import { Typography, CircularProgress } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { useState } from 'react';
import {
  IDeviceFirmwareResponse,
  IDIDResponse
} from 'types/response/zeus/firmwareTypes';
import { createEngineeringDid } from 'data/api/zeus';
import Button from 'core-components/Button';
import { PRODUCT_TYPES } from 'enums';
import { convertTimestampToTimeAndDate } from 'utils';
import AddDIDConfirm from '../AddDIDConfirm/AddDIDConfirm';

export interface DeviceManageDIDResponse {
  dID: string;
  inUse: string;
  online: string;
  currentFWVersion: string;
}

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
  margin-left: 12px;
`;

const AddDidButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  min-width: 120px;
`;

const DeviceManageDIDDetails = styled(CardWithDivider)`
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
const LoaderWrapper = styled.div``;

interface IDeviceManageDIDProps {
  oemId: string;
  deviceModelId: string;
  didList: IDIDResponse[];
  isLoadingDidList: boolean;
  reloadDIDList: () => void;
  productType: string;
  firmwareList: IDeviceFirmwareResponse[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeviceManageDID(props: IDeviceManageDIDProps) {
  const {
    didList,
    isLoadingDidList,
    oemId,
    deviceModelId,
    reloadDIDList,
    productType,
    firmwareList
  } = props;
  const [showDidModal, setShowDidModal] = useState(false);
  const [addDIDConfirmLoading, setAddDIDConfirmLoading] = useState(false);

  const handleAddDidClick = () => {
    setShowDidModal(true);
  };

  const handleCloseClick = () => {
    setShowDidModal(false);
  };

  const handleYesButtonClick = async () => {
    setAddDIDConfirmLoading(true);
    try {
      const response = await createEngineeringDid(oemId, deviceModelId);
      console.log('handleYesButtonClick', response);
      await reloadDIDList();
    } catch (error) {
      console.log('error', error);
    } finally {
      setAddDIDConfirmLoading(false);
      setShowDidModal(false);
    }
  };

  // const renderLastElement = () => {
  //   return (
  //     <DisplayText>
  //       <Item variant="body2" style={{ flex: 1 }}>
  //         <span style={{ fontWeight: '500' }} />
  //       </Item>
  //       <Item variant="body2" style={{ flex: 1 }}>
  //         <span style={{ fontWeight: '500' }} />
  //       </Item>
  //       <Item style={{ flex: 1 }}>
  //         <Typography variant="body2" />
  //       </Item>
  //       <Item sx={{ flex: 2 }}>
  //         <Item variant="body2" style={{ fontWeight: '500' }}>
  //           <button color="primary" onClick={handleAddDidClick} type="button">
  //             +Add DID
  //           </button>
  //         </Item>
  //       </Item>
  //     </DisplayText>
  //   );
  // };

  return (
    <div style={{ margin: '40px 0px' }}>
      <Header>
        <Typography variant="h3" sx={{ fontWeight: '500', flex: 2 }}>
          MANAGE DID
        </Typography>
        <AddDidButton
          label="Get DID"
          color="primary"
          onClick={handleAddDidClick}
          sx={{ fontSize: '16px', color: 'text.title', fontWeight: '500' }}
          isDisabled={firmwareList?.length === 0}
        >
          Get DID
        </AddDidButton>
      </Header>
      <TableHeaderContainer variant="instavisionCardWithBorder">
        <DisplayText>
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            DID
          </HeaderItem>
          {productType !== PRODUCT_TYPES.BABY && (
            <HeaderItem variant="body2" style={{ flex: 2 }}>
              Access Key
            </HeaderItem>
          )}
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            Current FW Version
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            In Use
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Online Status
          </HeaderItem>
        </DisplayText>
      </TableHeaderContainer>
      {isLoadingDidList && (
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
      {!isLoadingDidList &&
        (!didList || didList?.length === 0 ? (
          <MuiCard variant="instavisionCardWithBorder">
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                margin: '80px 0px',
                fontWeight: '500'
              }}
            >
              No DIDs Available for this Device.
            </Typography>
            {/* {renderLastElement()} */}
          </MuiCard>
        ) : (
          <DeviceManageDIDDetails sx={{ maxheight: '240px' }}>
            {didList.map((didElement) => {
              return (
                <DisplayText key={didElement?.id}>
                  <Item variant="body2" style={{ flex: 2 }}>
                    <span style={{ fontWeight: '500' }}>{didElement?.id}</span>
                  </Item>

                  {productType !== PRODUCT_TYPES.BABY && (
                    <Item
                      variant="body2"
                      style={{ fontWeight: '500', flex: 2 }}
                    >
                      {didElement?.access_key}
                    </Item>
                  )}
                  <Item sx={{ flex: 2 }}>
                    <Item variant="body2" style={{ fontWeight: '500' }}>
                      {didElement?.firmware_version}
                    </Item>
                  </Item>
                  <Item variant="body2" style={{ flex: 1 }}>
                    {didElement?.paired_on !== 0 ? (
                      (() => {
                        const { timeOnly, dateOnly } =
                          convertTimestampToTimeAndDate(didElement?.paired_on);
                        return (
                          <>
                            <Item
                              variant="body2"
                              style={{
                                fontWeight: '500',
                                color: '#333',
                                flex: 1
                              }}
                            >
                              {timeOnly}
                            </Item>
                            <Item
                              variant="body2"
                              style={{
                                fontWeight: '500',
                                color: '#333',
                                flex: 1
                              }}
                            >
                              {dateOnly}
                            </Item>
                          </>
                        );
                      })()
                    ) : (
                      <Item
                        variant="body2"
                        style={{ fontWeight: '500', flex: 2, color: '#333' }}
                      >
                        Not in use
                      </Item>
                    )}
                  </Item>
                  <Item style={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      style={{ fontWeight: '500', flex: 2, color: '#333' }}
                    >
                      {didElement?.status || '-'}
                    </Typography>
                  </Item>
                </DisplayText>
              );
            })}
            {/* {renderLastElement()} */}
          </DeviceManageDIDDetails>
        ))}

      <AddDIDConfirm
        openModal={showDidModal}
        onCloseClick={handleCloseClick}
        onYesButtonClick={handleYesButtonClick}
        addDIDConfirmLoading={addDIDConfirmLoading}
      />
    </div>
  );
}

export default DeviceManageDID;
