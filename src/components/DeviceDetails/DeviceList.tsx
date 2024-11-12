import CardWithShadow from 'core-components/CardWithShadow';
import styled from '@emotion/styled';
import { Chip, Typography, Button } from '@mui/material';
import Arrow from 'assets/new-assets/arrow.svg';
import Shield from 'assets/new-assets/shieldTick.svg';
// import AppLink from 'assets/new-assets/appLink.svg';
import CoreButton from 'core-components/Button';
import { useNavigate } from 'react-router-dom';
import CardWithDivider from 'core-components/CardWithDivider';
import { useEffect, useState } from 'react';
import {
  IEditDeviceModelResponse,
  IOemModelResponse
} from 'types/response/zeus/deviceTypes';
import RequestrProductionIcon from 'assets/new-assets/requestProductionIcon.svg';
import DevicePlaceholderImage from 'assets/new-assets/noDevicePlaceholderImage.png';
import DownloadButton from 'components/DownloadFile/DownloadFile';
import { DEVICE_MODEL_STATUS, PRODUCTION_DEVICE_MODEL_STATUS } from 'enums';
import RequestToReviewModel from 'components/RequestToReviewModel';
import { updateEngineeringDeviceModel } from 'data/api/zeus';
import { getItemFromLocalStorage } from 'utils';
import DeviceInfoIncompleteModal from 'components/DeviceInfoIncompleteModal/DeviceInfoIncomplete';
import EditDeviceModel from '../EditModel/index';
// import InstaSnackBar from 'components/SnackBar';

interface IValues {
  value: string | number | boolean | string[];
  label: string;
}
interface IDeviceModelDetails {
  category: string;
  sub_category: IValues[];
}

const LeftContainer = styled('aside')`
  flex-grow: 1;
  text-align: center;
`;
const RightContainer = styled('section')`
  flex-grow: 2;
  width: 100%;
`;

const DisplayText = styled('section')`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 20px 24px;
`;
const ImageContainer = styled('div')`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background: #fff;
  margin-bottom: 24px;
`;
const DeviceModelNameLeft = styled(Typography)`
  fontWeight: 600,
  textAlig: left;
  display: flex;
  overflow: hidden;
  transition: height 0.5s ease, opacity 1s ease;
  margin-bottom:24px;
  white-space: normal;  // allows wrapping to the next line
  overflow-wrap: anywhere; // wraps only at spaces, not within words
  max-width: 200px; // adjust width if necessary
`;

const LeftChipContainer = styled('div')`
  width: 200px;
  margin: 0;
`;
const EngineeringDeviceButtonBox = styled('header')`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-right: 12px;
  align-items: center;
  margin-bottom: 24px;
  overflow: hidden;
  transition:
    height 0.5s ease,
    opacity 1s ease;
`;

const ProductionDeviceButtonBox = styled('header')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
  overflow: hidden;
  transition:
    height 0.5s ease,
    opacity 1s ease;
`;

// const DeviceSpecifications = styled(CardWithDivider)<{ showMore: boolean }>`
//   flex-grow: 2;
//   max-height: ${({ showMore }) => (showMore ? '1000px' : '400px')};
//   height: auto;
//   overflow: hidden;
//   transition: max-height 2s ease;
// `;

const EditModelFormButton = styled(CoreButton)`
  width: 200px;
  font-size: 16px;
  font-weight: 500;
  height: 56px;
`;

const ArrowButtonContainer = styled('div')`
  margin-top: 24px;
  text-align: right;
`;

const ArrowIcon = styled('img')<{ rotate: boolean }>`
  transition: transform 0.3s ease; /* Smooth transition for rotation */
  transform: ${({ rotate }) => (rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
`;
const CustomButton = styled(Button)(() => ({
  width: '48px',
  minWidth: '48px',
  minHeight: '48px',
  borderRadius: '50%',
  cursor: 'pointer',
  background:
    'linear-gradient(113deg,rgba(228, 228, 228, 1), rgba(241, 241, 241, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
  border: '1px solid transparent',
  transition: 'background 0.3s, transform 0.3s',

  '&:hover': {
    background:
      'linear-gradient(113deg,rgba(210, 210, 210, 1), rgba(220, 220, 220, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
    transform: 'scale(1.1)'
  },
  '&:focus': {
    outline: 'none'
  },
  '&:active': {
    transform: 'scale(0.95)'
  }
}));

// const DeviceTitle = styled('header')`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 24px;
// `;

interface IDeviceListProps {
  deviceDetails: IOemModelResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // openEditDeviceModalForm: any;
  isEngineeringFlow: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // openRequestProductionModal: boolean;
  // closeRequestProductionModalForm: () => void;
  // isRequestProductionLoading: boolean;
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // onRequestProductionButtonClick: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchDeviceList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSnackbarOpen: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSeverity: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSnackbarMessage: any;
}

export function DeviceList(props: IDeviceListProps) {
  const {
    deviceDetails,
    isEngineeringFlow,
    // openRequestProductionModal,
    // openRequestProductionModalForm,
    // closeRequestProductionModalForm,
    // isRequestProductionLoading,
    // onRequestProductionButtonClick,
    fetchDeviceList,
    setSnackbarOpen,
    setSeverity,
    setSnackbarMessage
  } = props;

  const [showMore, setShowMore] = useState(false);
  const [openEditModal, setEditOpenModal] = useState(false);
  const [openRequestReviewModal, setOpenRequestReviewModal] = useState(false);
  const [isRequestReviewLoading, setIsRequestReviewLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isDatsheetUploaded, setIsDatasheetUploaded] = useState(false);
  const [openDeviceInfoIncompleteModel, setOpenDeviceInfoIncompleteModal] =
    useState(false);
  const oem_id = getItemFromLocalStorage('oem_id');
  const [isEditingDeviceModelLoading, setIsEditingDeviceModelLoading] =
    useState(false);
  const navigate = useNavigate();
  // console.log('Engineering flow:', isEngineeringFlow);

  useEffect(() => {
    setShowMore(false);
  }, [isEngineeringFlow]);

  const openEditDeviceModalForm = () => {
    setEditOpenModal(true);
  };

  const handleCloseDeviceInfoIncomplete = () => {
    setOpenDeviceInfoIncompleteModal(false);
  };

  const closeEditDeviceModalForm = () => setEditOpenModal(false);

  const handleEditButtonClick = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any,
    deviceModel: IOemModelResponse
  ) => {
    let editDeviceModelResponse: IEditDeviceModelResponse | string = '';
    setIsEditingDeviceModelLoading(true);
    setSnackbarOpen(false);
    try {
      editDeviceModelResponse = await updateEngineeringDeviceModel(
        oem_id,
        deviceModel.id,
        values
      );
      setSnackbarMessage('Device model informartion updated successfully');
      setSeverity('success');
      setSnackbarOpen(true);
      try {
        await fetchDeviceList();
      } catch (err) {
        console.log(
          'Failed to reload the list after editing device model',
          err
        );
      }
    } catch (error) {
      console.log('Error:', error);
      setSnackbarMessage(
        'Failed to update the device model information. Please try again.'
      );
      setSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsEditingDeviceModelLoading(false);
    }
    console.log('editUserResponse: ', editDeviceModelResponse);
    setEditOpenModal(false);
  };

  const checkImageAndDatasheetBeforeReview = () => {
    // Ensure we are setting booleans instead of strings or nulls
    const isImagePresent = !!(
      deviceDetails?.photo_urls && deviceDetails?.photo_urls[0]
    ); // Convert to boolean
    const isDatasheetPresent = !!deviceDetails?.datasheet; // Convert to boolean

    // Set state based on the values from deviceDetails
    setIsImageUploaded(isImagePresent);
    setIsDatasheetUploaded(isDatasheetPresent);

    return [isImagePresent, isDatasheetPresent]; // Return the flags as booleans
  };

  const openRequestReviewModalForm = () => {
    const [isImagePresent, isDatasheetPresent] =
      checkImageAndDatasheetBeforeReview();

    // Check the returned boolean values
    if (!isImagePresent || !isDatasheetPresent) {
      setOpenDeviceInfoIncompleteModal(true);
    } else {
      console.log('open Request Modal');
      setOpenRequestReviewModal(true);
    }
  };

  const closeRequestReviewModalForm = () => setOpenRequestReviewModal(false);

  const onRequestReviewButtonClick = async (id: string) => {
    setSnackbarOpen(false);
    try {
      setIsRequestReviewLoading(true);
      const payload = {
        status: DEVICE_MODEL_STATUS.REVIEW
      };
      const response = await updateEngineeringDeviceModel(oem_id, id, payload);
      console.log(response);
      setSnackbarMessage('Device Model sent for review successfully.');
      setSeverity('success');
      await fetchDeviceList();
    } catch (error) {
      console.error('error in model review request', error);
      setSnackbarMessage('Failed to sent Model Review Request.');
      setSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setIsRequestReviewLoading(false);
      closeRequestReviewModalForm();
    }
  };

  const deviceDetailsMapping: IDeviceModelDetails[] = [
    // Model Info
    // {
    //   category: 'MODEL INFORMATION',
    //   sub_category: [
    //     { label: 'Model Name', value: deviceDetails.model_name },
    //     // { label: 'Model Id', value: deviceDetails.id },
    //     // { label: 'OEM id', value: deviceDetails.oem_id},
    //     {
    //       label: 'Model Category',
    //       value: deviceDetails.product_type
    //     }
    //   ]
    // },

    // Chipset Category

    {
      category: 'CHIPSETS',
      sub_category: [
        {
          label: 'Chipset Vendor',
          value: deviceDetails?.chipset?.vendor
        },
        { label: 'Chipset Model', value: deviceDetails?.chipset?.model },
        {
          label: 'RAM',
          value: deviceDetails?.chipset?.ram
        },
        {
          label: 'Frequency',
          value: deviceDetails?.chipset?.frequency
        }
      ]
    },

    // Image Sensor
    {
      category: 'IMAGE SENSOR',
      sub_category: [
        {
          label: 'Image Sensor',
          value: deviceDetails?.image_sensor?.type
        },
        {
          label: 'Lux Sensitivity',
          value: deviceDetails?.image_sensor?.lux_sensitivity
        }
      ]
    },

    // lens
    {
      category: 'LENS',
      sub_category: [
        { label: 'Lens Type', value: deviceDetails?.lens?.type },
        { label: 'Viewing Angle', value: deviceDetails?.lens?.viewing_angle },
        { label: 'Focal Length', value: deviceDetails?.lens?.focal_length },
        {
          label: 'Number of Lenses',
          value: deviceDetails?.lens?.number_of_lenses
        }
      ]
    },

    // Night Vision
    {
      category: 'NIGHT VISION',
      sub_category: [
        { label: 'IR LED', value: deviceDetails?.night_vision?.ir_led },
        {
          label: 'IR Distance',
          value: deviceDetails?.night_vision?.ir_distance
        },
        {
          label: 'Day Night Mode',
          value: deviceDetails?.night_vision?.day_night_mode
        }
      ]
    },

    // VIDEO
    {
      category: 'VIDEO',
      sub_category: [
        {
          label: 'Video Compression',
          value: deviceDetails?.video?.video_compression
        },
        {
          label: 'Image Resolution',
          value: deviceDetails?.video?.image_resolution
        }
      ]
    },

    // Audio
    {
      category: 'AUDIO',
      sub_category: [
        { label: 'Input/Output', value: deviceDetails?.audio?.input_output },
        {
          label: 'Audio Compression',
          value: deviceDetails?.audio?.audio_compression
        }
      ]
    },

    // Network
    {
      category: 'NETWORK',
      sub_category: [
        { label: 'WiFi', value: deviceDetails?.network?.wifi },
        {
          label: 'Bluetooth',
          value: deviceDetails?.network?.bluetooth ? 'Yes' : 'No'
        },
        {
          label: 'Wireless Security',
          value: deviceDetails?.network?.wireless_security
        },
        { label: 'Frequency', value: deviceDetails?.network?.frequency }
      ]
    },

    // Reset
    {
      category: 'RESET',
      sub_category: [{ label: 'Reset', value: deviceDetails?.reset?.reset }]
    },

    // Detection and tracking
    {
      category: 'DETECTION AND TRACKING',
      sub_category: [
        {
          label: 'Motion Detection',
          value: deviceDetails?.detection_and_tracking?.motion_detection
            ? 'Yes'
            : 'No'
        },
        {
          label: 'Motion Tracking',
          value: deviceDetails?.detection_and_tracking?.motion_tracking
            ? 'Yes'
            : 'No'
        },
        {
          label: 'Human Tracking',
          value: deviceDetails?.detection_and_tracking?.human_tracking
            ? 'Yes'
            : 'No'
        },
        {
          label: 'Animal Tracking',
          value: deviceDetails?.detection_and_tracking?.animal_tracking
            ? 'Yes'
            : 'No'
        }
      ]
    },

    // Power Specifications
    {
      category: 'POWER SPECIFICATIONS',
      sub_category: [
        {
          label: 'Input Voltage',
          value: deviceDetails?.power_specifications?.input_voltage
        },
        {
          label: 'Power Consumption',
          value: deviceDetails?.power_specifications?.power_consumption
        },
        { label: 'Power', value: deviceDetails?.power_specifications?.power },
        {
          label: 'Battery Capacity',
          value: deviceDetails?.power_specifications?.battery_capacity
        }
      ]
    },

    // SD CARD
    {
      category: 'SD CARD',
      sub_category: [
        {
          label: 'SD Card Max Capacity',
          value: deviceDetails?.sd_card?.sd_card_max_capacity
        },
        {
          label: 'SD Card Storage',
          value: deviceDetails?.sd_card?.sd_card_storage ? 'Yes' : 'No'
        }
      ]
    },

    // TWO WAY AUDIO
    {
      category: 'TWO WAY AUDIO',
      sub_category: [
        {
          label: 'Duplexing Type',
          value: deviceDetails?.two_way_audio?.type_of_duplexing
        }
      ]
    },

    // Mounting
    {
      category: 'MOUNTING',
      sub_category: [
        {
          label: 'Wall Mount Set',
          value: deviceDetails?.mounting?.type_of_mounting
        }
      ]
    },

    // Pan and tilt
    {
      category: 'PAN AND TILT',
      sub_category: [
        {
          label: 'PTZ',
          value: deviceDetails?.pan_and_tilt?.ptz ? 'Yes' : 'No'
        },
        {
          label: 'Pan Viewing Angle',
          value: deviceDetails?.pan_and_tilt?.pan_viewing_angle
        },
        {
          label: 'Tilt Viewing Angle',
          value: deviceDetails?.pan_and_tilt?.tilt_viewing_angle
        },
        {
          label: 'Privacy Mode',
          value: deviceDetails?.pan_and_tilt?.privacy_mode ? 'Yes' : 'No'
        }
      ]
    },

    // Activity Zone
    {
      category: 'ACTIVITY ZONE',
      sub_category: [
        {
          label: 'Activity Zone Presence',
          value: deviceDetails?.activity_zone?.activity_zone_presence
            ? 'Yes'
            : 'No'
        },
        {
          label: 'Activity Zone Shape',
          value: deviceDetails?.activity_zone?.activity_zone_shape
        },
        {
          label: 'No of Zones',
          value: deviceDetails?.activity_zone?.number_of_zones
        }
      ]
    },

    // Audio Properties
    {
      category: 'AUDIO PROPERTIES',
      sub_category: [
        {
          label: 'Microphone',
          value: deviceDetails?.audio_properties?.microphone ? 'Yes' : 'No'
        },
        { label: 'Speaker', value: deviceDetails?.audio_properties?.speaker }
      ]
    },

    // IR Properties
    {
      category: 'IR PROPERTIES',
      sub_category: [
        {
          label: 'Vision Mode',
          value: deviceDetails?.ir_property?.vision_mode
        },
        {
          label: 'White Light',
          value: deviceDetails?.ir_property?.white_light ? 'Yes' : 'No'
        },
        {
          label: 'Number of LEDs',
          value: deviceDetails?.ir_property?.number_of_leds
        },
        {
          label: 'Night Vision Distance',
          value: deviceDetails?.ir_property?.night_vision_distance
        }
      ]
    },

    // Indicator Light
    {
      category: 'INDICATOR LIGHT',
      sub_category: [
        {
          label: 'Indicator Light',
          value: deviceDetails?.indicator_light?.indicator_light?.join(' ')
        }
      ]
    }
  ];

  function ReturnEngModelStatus(deviceStatus: string) {
    if (deviceStatus === DEVICE_MODEL_STATUS.DRAFT) {
      return {
        label: 'Draft',
        sx: {
          width: '100%',
          height: '36px',
          color: '#fff',
          bgcolor: 'primary.main',
          margin: '12px 0px',
          transition: 'all 0.5s ease'
        }
      };
    }
    if (deviceStatus === DEVICE_MODEL_STATUS.REVIEW) {
      return {
        label: 'In Review',
        sx: {
          width: '100%',
          height: '36px',
          color: '#fff',
          bgcolor: 'secondary.main',
          margin: '12px 0px',
          transition: 'all 0.5s ease'
        }
      };
    }
    if (deviceStatus === DEVICE_MODEL_STATUS.PUBLISHED) {
      return {
        label: 'Engineering (Live)',
        sx: {
          width: '100%',
          height: '36px',
          color: '#fff',
          bgcolor: 'success.main',
          margin: '12px 0px',
          transition: 'all 0.5s ease'
        }
      };
    }
    if (deviceStatus === DEVICE_MODEL_STATUS.REJECTED) {
      return {
        label: 'Rejected',
        sx: {
          width: '100%',
          height: '36px',
          color: '#fff',
          bgcolor: 'danger.main',
          margin: '12px 0px',
          transition: 'all 0.5s ease'
        }
      };
    }

    return null; // Default return if none of the conditions match
  }

  // Function to render the device details inside the card with divider
  const renderDeviceModelDetails = () => {
    const detailsToShow = showMore
      ? deviceDetailsMapping
      : deviceDetailsMapping.slice(0, 1);

    return detailsToShow.map((detail: IDeviceModelDetails) => (
      <div key={detail?.category}>
        <Typography
          variant="h4"
          sx={{ marginBottom: '24px', fontWeight: '600' }}
        >
          {detail?.category}
        </Typography>

        <CardWithDivider sx={{ marginBottom: '24px' }}>
          {detail?.sub_category.map((subDetail: IValues) => (
            <DisplayText
              key={subDetail.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <Typography variant="body2" style={{ fontWeight: '500' }}>
                {subDetail?.label}
              </Typography>
              <Typography
                variant="body2"
                color="text.title"
                style={{ opacity: '0.5', fontWeight: '500' }}
              >
                {subDetail?.value || 'N/A'}
              </Typography>
            </DisplayText>
          ))}
        </CardWithDivider>
      </div>
    ));
  };
  return (
    <CardWithShadow
      sx={{
        display: 'flex',
        padding: '32px',
        gap: '32px',
        marginBottom: '24px'
      }}
      key={deviceDetails?.id}
    >
      <LeftContainer>
        <ImageContainer>
          <img
            draggable={false}
            src={
              (deviceDetails?.photo_urls !== null &&
                deviceDetails?.photo_urls[0]) ||
              DevicePlaceholderImage
            }
            width="200px"
            height="200px"
            alt="Device"
            style={{ borderRadius: '20px' }}
          />
          <img
            src={Shield}
            draggable={false}
            alt="shield-icon"
            style={{
              width: '20px',
              position: 'absolute',
              right: '12px',
              top: '12px'
            }}
          />
        </ImageContainer>
        <DeviceModelNameLeft variant="h3">
          {deviceDetails?.model_name}
        </DeviceModelNameLeft>

        <LeftChipContainer>
          <Chip
            label={deviceDetails?.product_type}
            sx={{
              width: '100%',
              height: '36px',
              color: 'primary.main',
              bgcolor: '#fff',
              textAlign: 'center',
              transition: 'all 0.5s ease'
            }}
          />
          {!isEngineeringFlow &&
            deviceDetails.status ===
              PRODUCTION_DEVICE_MODEL_STATUS.PUBLISHED && (
              <Chip
                label="Live"
                sx={{
                  width: '100%',
                  height: '36px',
                  color: '#fff',
                  bgcolor: 'success.main',
                  margin: '12px 0px',
                  transition: 'all 0.5s ease'
                }}
              />
            )}
          {!isEngineeringFlow &&
            deviceDetails.status ===
              PRODUCTION_DEVICE_MODEL_STATUS.WAITING_FOR_FIRMWARE && (
              <Chip
                label="Firmware Required"
                sx={{
                  width: '100%',
                  height: '36px',
                  color: '#fff',
                  bgcolor: 'secondary.main',
                  margin: '12px 0px',
                  transition: 'all 0.5s ease'
                }}
              />
            )}
          {isEngineeringFlow && (
            <Chip {...ReturnEngModelStatus(deviceDetails?.status)} />
          )}
        </LeftChipContainer>
      </LeftContainer>
      <RightContainer>
        {isEngineeringFlow && (
          <EngineeringDeviceButtonBox>
            {(deviceDetails?.status === DEVICE_MODEL_STATUS.DRAFT ||
              deviceDetails?.status === DEVICE_MODEL_STATUS.REJECTED) && (
              <EditModelFormButton
                label="Edit Model"
                handleClick={openEditDeviceModalForm}
                sx={{ fontSize: '16px', flex: 1, maxWidth: '150px' }}
              >
                Edit Model
              </EditModelFormButton>
            )}
            <EditDeviceModel
              openModal={openEditModal}
              closeModal={closeEditDeviceModalForm}
              deviceModelData={deviceDetails}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onEditButtonClick={(values: any) =>
                handleEditButtonClick(values, deviceDetails)
              }
              isEditingDeviceModelLoading={isEditingDeviceModelLoading}
              fetchDeviceList={fetchDeviceList}
            />
            <CoreButton
              label="Manage Firmware and DID"
              handleClick={() =>
                navigate(`/engineering/firmware/${deviceDetails?.id}`)
              }
              style={{
                fontSize: '16px',
                height: '56px',
                flex: 2,
                maxWidth: '300px'
              }}
            >
              Manage Firmware and DID
            </CoreButton>
            {(deviceDetails.status === DEVICE_MODEL_STATUS.DRAFT ||
              deviceDetails.status === DEVICE_MODEL_STATUS.REJECTED) && (
              <>
                <CoreButton
                  label="Request to Review"
                  handleClick={() => openRequestReviewModalForm()}
                  style={{
                    fontSize: '16px',
                    height: '56px',
                    flex: 2,
                    border: '2px solid #F35D1D',
                    maxWidth: '300px',
                    marginRight: '12px'
                  }}
                  sx={{ color: 'secondary.main' }}
                >
                  <img
                    src={RequestrProductionIcon}
                    alt="link"
                    width="24"
                    style={{ marginRight: '12px' }}
                  />
                  Request to Review
                </CoreButton>
                <RequestToReviewModel
                  selectedDeviceName={deviceDetails?.model_name}
                  openRequestToReviewModal={openRequestReviewModal}
                  handleRequestToReviewClose={closeRequestReviewModalForm}
                  isRequestToReviewLoading={isRequestReviewLoading}
                  handleRequestToReviewButtonClick={() =>
                    onRequestReviewButtonClick(deviceDetails?.id)
                  }
                />
              </>
            )}
            <DownloadButton
              fileUrl={deviceDetails.datasheet}
              fileAvailableTooltipText="Download Datasheet"
              fileUnavailableTooltipText="No Datasheet Available"
            />
            {/* <RequestProduction
              openModal={openRequestProductionModal}
              closeModal={closeRequestProductionModalForm}
              deviceId={deviceDetails.id}
              isRequestProductionLoading={isRequestProductionLoading}
              onRequestProductionButtonClick={() =>
                onRequestProductionButtonClick(deviceDetails.id)
              }
            /> */}
          </EngineeringDeviceButtonBox>
        )}

        {!isEngineeringFlow && (
          <ProductionDeviceButtonBox>
            <CoreButton
              label="Manage Firmware"
              handleClick={() =>
                navigate(`/production/firmware/${deviceDetails?.id}`)
              }
              style={{
                fontSize: '16px',
                height: '56px',
                flex: 2,
                border: '2px solid #F35D1D',
                maxWidth: '300px',
                marginRight: '12px'
              }}
              sx={{ color: 'secondary.main' }}
            >
              Manage Firmware
            </CoreButton>
            <DownloadButton
              fileUrl={deviceDetails?.datasheet}
              fileAvailableTooltipText="Download Datasheet"
              fileUnavailableTooltipText="No Datasheet Available"
            />
          </ProductionDeviceButtonBox>
        )}

        {renderDeviceModelDetails()}

        <ArrowButtonContainer>
          <CustomButton
            disableRipple
            onClick={() => setShowMore(!showMore)}
            sx={{ transition: 'all 0.5s ease' }}
          >
            <ArrowIcon
              src={Arrow}
              alt="drop-down-arrow"
              width="24px"
              height="24px"
              rotate={showMore}
              style={{ transition: 'all 0.5s ease' }}
            />
          </CustomButton>
        </ArrowButtonContainer>
      </RightContainer>
      <DeviceInfoIncompleteModal
        openDeviceInfoIncompleteModel={openDeviceInfoIncompleteModel}
        handleCloseDeviceInfoIncomplete={handleCloseDeviceInfoIncomplete}
        isImageUploaded={isImageUploaded}
        isDatsheetUploaded={isDatsheetUploaded}
      />
    </CardWithShadow>
  );
}
