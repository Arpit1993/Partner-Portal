import {
  Button as ButtonMui,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Typography
} from '@mui/material';
import CrossIcon from 'assets/new-assets/cross.svg';
import Button from 'core-components/Button';
import CardWithDivider from 'core-components/CardWithDivider';
import CoreModal from 'core-components/Modal/Modal';
import { Formik } from 'formik';
import styled from 'styled-components';
// import DeviceImage from 'assets/new-assets/device.svg';
// import Input from 'core-components/Input';
import Card from '@mui/material/Card';
import MultiSelectWithCheckbox from 'core-components/MultiSelectWithCheckbox';
import PlainSelect from 'core-components/PlainSelect';
import InstaTextField from 'core-components/TextField';
import {
  getPreSignedUrl,
  updateEngineeringDeviceModel,
  uploadTheAssetsToAmazon
} from 'data/api/zeus';
import { ADD_CAMERA_MODEL_STEPS, DEVICE_MODEL_STATUS } from 'enums';
import { useState } from 'react';
import { ICreateDeviceModelRequest } from 'types/request/zeus/deviceTypes';
import { getBaseUrl, getItemFromLocalStorage, getOemAndUserId } from 'utils';
import * as Yup from 'yup';
import ImageUpload from '../ImageUpload/ImageUpload';
import UploadDatasheet from '../UploadDatasheet/UploadDatasheet';

const AddModelButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

const FormField = styled('div')`
  width: 600px;
  padding: 12px;
`;

const ModelFormInput = styled(InstaTextField)``;

const ModelFeatureSelect = styled(PlainSelect)`
  text-align: left;
`;

const Header = styled('header')`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CrossImage = styled('img')`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const CancelButton = styled(ButtonMui)`
  padding: 12px 0px;
  border: none;
  width: 100%;
  font-size: 20px;
  borderradius: 50%;
  transition: all 0.9s ease;

  &:hover {
    border: none;
    font-weight: 600;
  }

  &:active {
    border: none;
    outline: none;
    font-weight: 600;
  }
`;

const MainContainer = styled('div')`
  flex-grow: 2;
  padding: 4px;
  overflow-y: scroll;
  max-height: 83vh;
`;

const ErrorBox = styled('p')`
  color: #d32f2f;
  font-size: 12px;
  padding-left: 16px;
  margin-bottom: 4px;
`;

const validationSchema = Yup.object().shape({
  model_name: Yup.string().trim().required('Model Name required'),
  model_category: Yup.string().trim().required('Model Category required'),
  chipset_ram: Yup.number().min(0, 'Chipset RAM cannot be negative'),
  focal_length: Yup.number(),
  number_of_lenses: Yup.number()
    .required('Number of Lenses required')
    .min(1, 'Number of Lenses must be at least 1'),
  ir_led: Yup.string().trim().required('IR LED required'),
  ir_distance: Yup.string().trim().required('IR Distance required'),
  day_night_mode: Yup.string().trim().required('Day Night Mode required'),
  wifi: Yup.string().trim().required('Wifi required'),
  bluetooth: Yup.string().trim().required('Bluetooth required'),
  wireless_security: Yup.string().trim().required('Wireless Security required'),
  frequency: Yup.number()
    .required('Frequency is required')
    .min(1, 'Frequency needs to be at least 1'),
  motion_detection: Yup.string().required('Motion Detection required'),
  motion_tracking: Yup.string().required('Motion Tracking required'),
  human_tracking: Yup.string().required('Human Tracking required'),
  animal_tracking: Yup.string().required('Animal Tracking required'),
  vehicle_tracking: Yup.string().required('Vehicle Tracking required'),
  input_voltage: Yup.string().trim().required('Input Voltage required'),
  power_consumption: Yup.string().trim().required('Power consumption required'),
  power: Yup.string().trim().required('Power required'),
  sd_card_storage: Yup.string().trim().required('SD Card support required'),
  ptz: Yup.string().trim().required('Ptz required'),
  privacy_mode: Yup.string().trim().required('Privacy Mode required'),
  activity_zone_presence: Yup.string()
    .trim()
    .required('Activity Zone presence required'),
  activity_zone_shape: Yup.string().required('Activity Zone shape required'),
  number_of_zones: Yup.number()
    .required('Number of zones required')
    .min(1, 'Number of zones must be at least 1'),
  microphone: Yup.string().required('Microphone required'),
  speaker: Yup.string().required('Speaker required'),
  night_vision_distance: Yup.number(),
  white_light: Yup.string().required('White Light required'),
  vision_mode: Yup.string().required('Vision Mode required'),
  number_of_leds: Yup.number()
    .required('Number of Leds required')
    .min(1, 'Number of LEDs must be at least 1'),
  indicator_light: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one indicator light is required')
    .required('Indicator Light is required')
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AddNewModel(props: any) {
  const {
    openModal,
    closeModal,
    addModelButtonClick,
    isAddingDeviceModelLoading,
    dId,
    handleCloseAddDeviceSecondForm,
    currentStep,
    setSnackbarOpen,
    setSnackbarMessage,
    setSeverity
  } = props;

  // const [currentStep, setCurrentStep] = useState(
  //   ADD_CAMERA_MODEL_STEPS.STEP_ONE
  // );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (values: any) => {
    console.log('values', values);
    try {
      addModelButtonClick(values);
    } catch (error) {
      console.log('error in creating a model', error);
      closeModal();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [imageFile, setImageFile] = useState<any>(null);
  const [openUploadImageModal, setOpenUploadImageModal] = useState(false);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [photoUrl, setPhotoUrl] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isDatasheetUploaded, setIsDatasheetUploaded] = useState(false);
  const { oem_id } = getOemAndUserId();

  const handleOpenImageModal = () => {
    setOpenUploadImageModal(true);
  };

  const handleCloseImageModal = () => {
    setPreviewImageUrl(photoUrl || previewImageUrl);
    setImageFile(null);
    setOpenUploadImageModal(false);
  };

  const handleImageFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userSelectedFile = event.target.files?.[0];
    setImageFile(userSelectedFile);
  };

  // eslint-disable-next-line consistent-return
  const getUploadImageUrl = async (file: File) => {
    try {
      const { name } = file;
      const extensionFile = name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}.${extensionFile}`;
      const type = 'image';
      const { url } = await getPreSignedUrl(oem_id, dId, type, fileName);
      await uploadTheAssetsToAmazon(url, file);
      const imageBaseUrl = getBaseUrl(url);
      console.log('image Url after splitting', imageBaseUrl);
      return [imageBaseUrl];
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleImageUploadButtonClick = async () => {
    setIsImageUploadLoading(true);
    setSnackbarOpen(false);
    try {
      if (imageFile) {
        setPreviewImageUrl(URL.createObjectURL(imageFile));
        const baseUrl = await getUploadImageUrl(imageFile);
        const payload = {
          photo_urls: baseUrl
        };
        await updateEngineeringDeviceModel(oem_id, dId, payload);
        setSeverity('success');
        setSnackbarMessage('Device model image uploaded successfully.');
        setSnackbarOpen(true);
        setIsImageUploaded(true);
      }
    } catch (error) {
      console.log('Error in uploading files');
      setSeverity('error');
      setSnackbarMessage('Failed to upload image. Please try again');
      setSnackbarOpen(true);
      setImageFile(null);
    } finally {
      setIsImageUploadLoading(false);
      setOpenUploadImageModal(false);
    }
  };

  const resetFormStates = () => {
    setImageFile(null);
    setPreviewImageUrl('');
    setIsImageUploaded(false);
    setIsDatasheetUploaded(false);
    setOpenUploadImageModal(false);
  };

  const handleCloseSecondForm = () => {
    resetFormStates();
    handleCloseAddDeviceSecondForm(); // Existing logic to close the second form
  };

  const returnRelevantStep = (step: string) => {
    switch (step) {
      case ADD_CAMERA_MODEL_STEPS.STEP_ONE:
        return (
          <>
            <Header>
              <Typography
                variant="h3"
                sx={{ fontWeight: '500', marginBottom: '20px 0px' }}
              >
                Step 1: Add Model Specifications
              </Typography>
              <CrossImage src={CrossIcon} alt="cross" onClick={closeModal} />
            </Header>
            <Formik
              initialValues={{
                // Model Information
                model_category: '',
                oem_name: '',
                model_name: '',
                model_id: '',

                // Chipset
                chipset_vendor: '',
                chipset_model: '',
                chipset_frequency: '',
                chipset_ram: '',

                // Lens
                lens_type: '',
                viewing_angle: '',
                focal_length: '',
                number_of_lenses: '',

                // Image sensor
                image_sensor: '',
                lux_sensitivity: '',

                // IR Property

                vision_mode: '',
                white_light: '',
                number_of_leds: '',
                night_vision_distance: '',

                // IndicatorLight
                indicator_light: [],

                // NightVision
                ir_led: '',
                ir_distance: '',
                day_night_mode: '',

                // Video
                video_compression: '',
                image_resolution: '',

                // Pan And Tilt
                ptz: '',
                pan_viewing_angle: '',
                tilt_viewing_angle: '',
                privacy_mode: '',

                // Network
                bluetooth: '',
                wifi: '',
                wireless_security: '',
                frequency: '',

                // Activity Zone
                activity_zone_presence: '',
                activity_zone_shape: '',
                number_of_zones: '',

                // Power Specifications
                input_voltage: '',
                power_consumption: '',
                power: '',
                battery_capacity: '',

                // Detection And tracking
                motion_detection: '',
                motion_tracking: '',
                human_tracking: '',
                animal_tracking: '',
                vehicle_tracking: '',

                // Audio
                audio_compression: '',
                input_output: '',

                // Audio Properties
                microphone: '',
                speaker: '',

                //  ISDCard
                sd_card_max_capacity: '',
                sd_card_storage: '',

                // TwoWayAudio
                type_of_duplexing: '',

                // Mounting
                type_of_mounting: '',

                // Reset
                reset: '',

                // Status
                status: '',

                // PhotoUrls
                photo_urls: [],

                // Datasheet
                datasheet: ''
              }}
              onSubmit={(values) => {
                const formattedValues: ICreateDeviceModelRequest = {
                  // model_info: {
                  //   model_category: values.model_category,
                  //   oem_name: values.oem_name,
                  //   model_id: values.model_id
                  // },
                  model_name: values.model_name,
                  oem_id: getItemFromLocalStorage('oem_id'),
                  product_type: values.model_category,
                  chipset: {
                    vendor: values.chipset_vendor,
                    model: values.chipset_model,
                    frequency: values.chipset_frequency,
                    ram: Number(values.chipset_ram)
                  },
                  lens: {
                    type: values.lens_type,
                    viewing_angle: Number(values.viewing_angle),
                    focal_length: Number(values.focal_length),
                    number_of_lenses: Number(values.number_of_lenses)
                  },
                  image_sensor: {
                    type: values.image_sensor,
                    lux_sensitivity: Number(values.lux_sensitivity)
                  },
                  ir_property: {
                    white_light: Boolean(values.white_light),
                    vision_mode: values.vision_mode,
                    number_of_leds: Number(values.number_of_leds),
                    night_vision_distance: Number(values.night_vision_distance)
                  },
                  indicator_light: {
                    indicator_light: values.indicator_light
                  },
                  night_vision: {
                    ir_led: values.ir_led,
                    ir_distance: values.ir_distance,
                    day_night_mode: values.day_night_mode
                  },
                  audio: {
                    input_output: values.input_output,
                    audio_compression: values.audio_compression
                  },
                  video: {
                    video_compression: values.video_compression,
                    image_resolution: values.image_resolution
                  },
                  pan_and_tilt: {
                    ptz: Boolean(values.ptz),
                    pan_viewing_angle: values.pan_viewing_angle,
                    tilt_viewing_angle: values.tilt_viewing_angle,
                    privacy_mode: Boolean(values.privacy_mode)
                  },
                  network: {
                    bluetooth: Boolean(values.bluetooth),
                    wifi: values.wifi,
                    wireless_security: values.wireless_security,
                    frequency: Number(values.frequency)
                  },
                  reset: {
                    reset: values.reset
                  },
                  activity_zone: {
                    activity_zone_presence: Boolean(
                      values.activity_zone_presence
                    ),
                    activity_zone_shape: values.activity_zone_shape,
                    number_of_zones: Number(values.number_of_zones)
                  },
                  power_specifications: {
                    input_voltage: values.input_voltage,
                    power_consumption: values.power_consumption,
                    power: values.power,
                    battery_capacity: values.battery_capacity
                  },
                  detection_and_tracking: {
                    motion_detection: Boolean(values.motion_detection),
                    motion_tracking: Boolean(values.motion_tracking),
                    human_tracking: Boolean(values.human_tracking),
                    animal_tracking: Boolean(values.animal_tracking),
                    vehicle_tracking: Boolean(values.vehicle_tracking)
                  },
                  audio_properties: {
                    microphone: Boolean(values.microphone),
                    speaker: values.speaker
                  },
                  sd_card: {
                    sd_card_max_capacity: values.sd_card_max_capacity,
                    sd_card_storage: Boolean(values.sd_card_storage)
                  },
                  two_way_audio: {
                    type_of_duplexing: values.type_of_duplexing
                  },
                  mounting: {
                    type_of_mounting: values.type_of_mounting
                  },
                  status: DEVICE_MODEL_STATUS.DRAFT
                  // photo_urls: values.photo_urls,
                  // datasheet: values.datasheet
                };
                // console.log('Form values: ', values);
                handleFormSubmit(formattedValues);
              }}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={validationSchema}
            >
              {({ errors, touched, values, handleChange, handleSubmit }) => {
                console.log('errors', errors, values);
                return (
                  <form onSubmit={handleSubmit}>
                    <MainContainer>
                      <CardWithDivider style={{}}>
                        <FormField>
                          <ModelFormInput
                            name="model_name"
                            id="model_name"
                            label="Model Name *"
                            placeholder="Model Name"
                            value={values.model_name}
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                            error={
                              touched.model_name && Boolean(errors.model_name)
                            }
                            helperText={touched.model_name && errors.model_name}
                          />
                        </FormField>
                        <FormControl fullWidth>
                          <InputLabel
                            id="model_category_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.model_category
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Model Category *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="model_category_label"
                            name="model_category"
                            id="model_category"
                            value={values.model_category}
                            onChange={handleChange}
                            sx={{ marginTop: '12px' }}
                            error={
                              touched.model_category &&
                              Boolean(errors.model_category)
                            }
                          >
                            <MenuItem value="HomeSecurity">
                              Home Security
                            </MenuItem>
                            <MenuItem value="Baby">Baby</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.model_category && (
                            <ErrorBox>{errors?.model_category}</ErrorBox>
                          )}
                        </FormControl>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        CHIPSET
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormField>
                          <ModelFormInput
                            id="chipset_vendor"
                            name="chipset_vendor"
                            label="Chipset Vendor"
                            placeholder="Chipset Vendor"
                            value={values.chipset_vendor}
                            onChange={handleChange}
                            type="text"
                            fullWidth
                            variant="standard"
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="chipset_model"
                            name="chipset_model"
                            label="Chipset Model"
                            placeholder="Chipset Model"
                            value={values.chipset_model}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="chipset_frequency"
                            name="chipset_frequency"
                            label="Chipset Frequency"
                            placeholder="Chipset Frequency"
                            value={values.chipset_frequency}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="chipset_ram"
                            name="chipset_ram"
                            label="Chipset RAM"
                            placeholder="Chipset RAM"
                            value={values.chipset_ram}
                            onChange={handleChange}
                            type="number"
                            variant="standard"
                            fullWidth
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            error={
                              touched.chipset_ram && Boolean(errors.chipset_ram)
                            }
                            helperText={
                              touched.chipset_ram && errors.chipset_ram
                            }
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        IMAGE SENSOR
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormField>
                          <ModelFormInput
                            id="image_sensor"
                            name="image_sensor"
                            placeholder="Image Sensor Type"
                            label="Image Sensor Type"
                            value={values.image_sensor}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="lux_sensitivity"
                            name="lux_sensitivity"
                            label="Lux Sensitivity"
                            placeholder="Lux Sensitivity"
                            value={values.lux_sensitivity}
                            onChange={handleChange}
                            type="number"
                            variant="standard"
                            fullWidth
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        LENS
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormField>
                          <ModelFormInput
                            id="lens_type"
                            name="lens_type"
                            placeholder="Lens Type"
                            label="Lens Type"
                            value={values.lens_type}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="viewing_angle"
                            name="viewing_angle"
                            placeholder="Viewing Angle"
                            label="Viewing Angle"
                            value={values.viewing_angle}
                            onChange={handleChange}
                            type="number"
                            variant="standard"
                            fullWidth
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="focal_length"
                            name="focal_length"
                            placeholder="Focal Length"
                            label="Focal Length"
                            value={values.focal_length}
                            onChange={handleChange}
                            type="number"
                            variant="standard"
                            // required
                            fullWidth
                            error={
                              touched.focal_length &&
                              Boolean(errors.focal_length)
                            }
                            helperText={
                              touched.focal_length && errors.focal_length
                            }
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="number_of_lenses"
                            name="number_of_lenses"
                            placeholder="Number of Lenses"
                            label="Number of Lenses *"
                            value={values.number_of_lenses}
                            onChange={handleChange}
                            type="number"
                            // required
                            variant="standard"
                            fullWidth
                            error={
                              touched.number_of_lenses &&
                              Boolean(errors.number_of_lenses)
                            }
                            helperText={
                              touched.number_of_lenses &&
                              errors.number_of_lenses
                            }
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        NIGHT VISION
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormField>
                          <ModelFormInput
                            id="ir_led"
                            name="ir_led"
                            label="IR LED *"
                            placeholder="IR LED"
                            value={values.ir_led}
                            onChange={handleChange}
                            type="text"
                            // required
                            fullWidth
                            variant="standard"
                            error={touched.ir_led && Boolean(errors.ir_led)}
                            helperText={touched.ir_led && errors.ir_led}
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="ir_distance"
                            name="ir_distance"
                            label="IR Distance *"
                            placeholder="IR Distance"
                            value={values.ir_distance}
                            onChange={handleChange}
                            type="text"
                            // required
                            fullWidth
                            variant="standard"
                            error={
                              touched.ir_distance && Boolean(errors.ir_distance)
                            }
                            helperText={
                              touched.ir_distance && errors.ir_distance
                            }
                          />
                        </FormField>
                        <FormControl fullWidth>
                          <InputLabel
                            id="day_night_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.day_night_mode
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Day Night Mode *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="day_night_label"
                            name="day_night_mode"
                            id="day_night_mode"
                            label="Day Night Mode *"
                            value={values.day_night_mode}
                            onChange={handleChange}
                            sx={{
                              paddingTop: '12px'
                            }}
                            error={
                              touched.day_night_mode &&
                              Boolean(errors.day_night_mode)
                            }
                          >
                            <MenuItem value="Night Vision">
                              Night Vision
                            </MenuItem>
                            <MenuItem value="Light Mode">Light Mode</MenuItem>
                            <MenuItem value="Light Mode and Night Vision">
                              Light Mode and Night Vision
                            </MenuItem>
                          </ModelFeatureSelect>
                          {errors?.day_night_mode && (
                            <ErrorBox>{errors?.day_night_mode}</ErrorBox>
                          )}
                        </FormControl>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        VIDEO
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormField>
                          <ModelFormInput
                            id="video_compression"
                            name="video_compression"
                            label="Video Compression"
                            placeholder="Video Compression"
                            value={values.video_compression}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="image_resolution"
                            name="image_resolution"
                            label="Image Resolution"
                            placeholder="Image Resolution"
                            value={values.image_resolution}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        AUDIO
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="input_output_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px'
                            }}
                          >
                            Input/Output
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="input_output_label"
                            name="input_output"
                            id="input_output"
                            value={values.input_output}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Model Category *'",
                              //   color: '#777'
                              // },
                              paddingTop: '12px'
                            }}
                          >
                            <MenuItem value="Input">Input</MenuItem>
                            <MenuItem value="Output">Output</MenuItem>
                            <MenuItem value="Input and Output">
                              Input and Output
                            </MenuItem>
                          </ModelFeatureSelect>
                        </FormControl>
                        <FormField>
                          <ModelFormInput
                            id="audio_compression"
                            name="audio_compression"
                            placeholder="Audio Compression"
                            label="Audio Compression"
                            value={values.audio_compression}
                            onChange={handleChange}
                            type="text"
                            fullWidth
                            variant="standard"
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        NETWORK
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="wifi_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.wifi
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            WiFi: 2.4G/5G *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="wifi_label"
                            name="wifi"
                            id="wifi"
                            label="WiFi"
                            value={values.wifi}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'WiFi: 2.4G/5G *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={touched.wifi && Boolean(errors.wifi)}
                          >
                            <MenuItem value="2.4 GHz">2.4 GHz</MenuItem>
                            <MenuItem value="2.4/5 GHz">2.4/5 GHz</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.wifi && <ErrorBox>{errors?.wifi}</ErrorBox>}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="bluetooth_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.bluetooth
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Bluetooth *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="bluetooth_label"
                            name="bluetooth"
                            id="bluetooth"
                            label="Bluetooth"
                            value={values.bluetooth}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Bluetooth *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.bluetooth && Boolean(errors.bluetooth)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.bluetooth && (
                            <ErrorBox>{errors?.bluetooth}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="wireless_security_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.wireless_security
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Wireless Security *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="wireless_security_label"
                            name="wireless_security"
                            id="wireless_security"
                            value={values.wireless_security}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Wireless Security'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.wireless_security &&
                              Boolean(errors.wireless_security)
                            }
                          >
                            <MenuItem value="WEP">WEP</MenuItem>
                            <MenuItem value="WPA">WPA</MenuItem>
                            <MenuItem value="WPA2">WPA2</MenuItem>
                            <MenuItem value="WPA3">WPA3</MenuItem>
                            <MenuItem value="WEP, WPA">WEP, WPA</MenuItem>
                            <MenuItem value="WEP, WPA2">WEP, WPA2</MenuItem>
                            <MenuItem value="WEP, WPA3">WEP, WPA3</MenuItem>
                            <MenuItem value="WPA, WPA2">WPA, WPA2</MenuItem>
                            <MenuItem value="WPA, WPA3">WPA, WPA3</MenuItem>
                            <MenuItem value="WPA2, WPA3">WPA2, WPA3</MenuItem>
                            <MenuItem value="WEP, WPA, WPA2">
                              WEP, WPA, WPA2
                            </MenuItem>
                            <MenuItem value="WEP, WPA, WPA3">
                              WEP, WPA, WPA3
                            </MenuItem>
                            <MenuItem value="WEP, WPA2, WPA3">
                              WEP, WPA2, WPA3
                            </MenuItem>
                            <MenuItem value="WPA, WPA2, WPA3">
                              WPA, WPA2, WPA3
                            </MenuItem>
                            <MenuItem value="WEP, WPA, WPA2, WPA3">
                              WEP, WPA, WPA2, WPA3
                            </MenuItem>
                          </ModelFeatureSelect>
                          {errors?.wireless_security && (
                            <ErrorBox>{errors?.wireless_security}</ErrorBox>
                          )}
                        </FormControl>
                        <FormField>
                          <ModelFormInput
                            id="frequency"
                            name="frequency"
                            placeholder="Frequency"
                            label="Frequency *"
                            value={values.frequency}
                            onChange={handleChange}
                            type="number"
                            // required
                            variant="standard"
                            fullWidth
                            error={
                              touched.frequency && Boolean(errors.frequency)
                            }
                            helperText={touched.frequency && errors.frequency}
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        RESET
                      </Typography>
                      <Card
                        sx={{ marginBottom: '20px' }}
                        variant="instavisionCardWithBorder"
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id="reset_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px'
                            }}
                          >
                            Hardware Reset
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="reset_label"
                            name="reset"
                            id="reset"
                            value={values.reset}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Reset'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </ModelFeatureSelect>
                        </FormControl>
                      </Card>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        DETECTION AND TRACKING
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="motion_detection_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.motion_detection
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Motion Detection *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="motion_detection_label"
                            name="motion_detection"
                            id="motion_detection"
                            value={values.motion_detection}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Motion Detection *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.motion_detection &&
                              Boolean(errors.motion_detection)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.motion_detection && (
                            <ErrorBox>{errors?.motion_detection}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="motion_tracking_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.motion_tracking
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Motion Tracking *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="motion_tracking_label"
                            name="motion_tracking"
                            id="motion_tracking"
                            value={values.motion_tracking}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Motion Tracking *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.motion_tracking &&
                              Boolean(errors.motion_tracking)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.motion_tracking && (
                            <ErrorBox>{errors?.motion_tracking}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="human_tracking_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.human_tracking
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Human Tracking *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="human_tracking_label"
                            name="human_tracking"
                            id="human_tracking"
                            value={values.human_tracking}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Human Tracking *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.human_tracking &&
                              Boolean(errors.human_tracking)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.human_tracking && (
                            <ErrorBox>{errors?.human_tracking}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="animal_tracking_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.animal_tracking
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Animal Tracking *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="animal_tracking_label"
                            name="animal_tracking"
                            id="animal_tracking"
                            value={values.animal_tracking}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Animal Tracking *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.animal_tracking &&
                              Boolean(errors.animal_tracking)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.animal_tracking && (
                            <ErrorBox>{errors?.animal_tracking}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="vehicle_tracking_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.vehicle_tracking
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Vehical Tracking *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="vehicle_tracking_label"
                            name="vehicle_tracking"
                            id="vehicle_tracking"
                            value={values.vehicle_tracking}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Vehicle Tracking *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.vehicle_tracking &&
                              Boolean(errors.vehicle_tracking)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.vehicle_tracking && (
                            <ErrorBox>{errors?.vehicle_tracking}</ErrorBox>
                          )}
                        </FormControl>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        POWER SPECIFICATIONS
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormField>
                          <ModelFormInput
                            id="input_voltage"
                            name="input_voltage"
                            placeholder="Input Voltage"
                            label="Input Voltage *"
                            value={values.input_voltage}
                            onChange={handleChange}
                            type="text"
                            // required
                            error={
                              touched.input_voltage &&
                              Boolean(errors.input_voltage)
                            }
                            helperText={
                              touched.input_voltage && errors.input_voltage
                            }
                            fullWidth
                            variant="standard"
                          />
                        </FormField>
                        <FormField>
                          <FormControl fullWidth>
                            <ModelFormInput
                              id="power_consumption"
                              name="power_consumption"
                              placeholder="Power Consumption"
                              label="Power Consumption *"
                              value={values.power_consumption}
                              onChange={handleChange}
                              type="text"
                              // required
                              error={
                                touched.power_consumption &&
                                Boolean(errors.power_consumption)
                              }
                              helperText={
                                touched.power_consumption &&
                                errors.power_consumption
                              }
                              fullWidth
                              variant="standard"
                            />
                          </FormControl>
                        </FormField>
                        <FormControl fullWidth>
                          <InputLabel
                            id="power_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.power
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Power: AC/Battery *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="power_label"
                            name="power"
                            id="power"
                            value={values.power}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Power: AC/Battery *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={touched.power && Boolean(errors.power)}
                          >
                            <MenuItem value="AC">AC</MenuItem>
                            <MenuItem value="Battery">Battery</MenuItem>
                            <MenuItem value="AC and Battery">
                              AC and Battery
                            </MenuItem>
                          </ModelFeatureSelect>
                          {errors?.power && (
                            <ErrorBox>{errors?.power}</ErrorBox>
                          )}
                        </FormControl>

                        <FormField>
                          <ModelFormInput
                            id="battery_capacity"
                            name="battery_capacity"
                            placeholder="Battery Capacity"
                            label="Battery Capacity"
                            value={values.battery_capacity}
                            onChange={handleChange}
                            // disabled={values.power === 'AC'}
                            type="text"
                            variant="standard"
                            fullWidth
                            // InputProps={{
                            //   sx: {
                            //     '&.Mui-disabled': {
                            //       '&:before': {
                            //         borderBottom: 'none' // Ensure no underline when disabled
                            //       },
                            //       '&:after': {
                            //         borderBottom: 'none' // Ensure no underline when focused
                            //       }
                            //     }
                            //   }
                            // }}
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        SD CARD
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="sd_card_storage_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.sd_card_storage
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            SD Card Support *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="sd_card_storage_label"
                            name="sd_card_storage"
                            id="sd_card_storage"
                            value={values.sd_card_storage}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'SD Card Support *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.sd_card_storage &&
                              Boolean(errors.sd_card_storage)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.sd_card_storage && (
                            <ErrorBox>{errors?.sd_card_storage}</ErrorBox>
                          )}
                        </FormControl>
                        <FormField>
                          <ModelFormInput
                            id="sd_card_max_capacity"
                            name="sd_card_max_capacity"
                            placeholder="SD Card Max Capacity"
                            label="SD Card Max Capacity"
                            value={values.sd_card_max_capacity}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            // disabled={values.sd_card_storage === 'false'}
                            fullWidth
                            // InputProps={{
                            //   sx: {
                            //     '&.Mui-disabled': {
                            //       '&:before': {
                            //         borderBottom: 'none' // Ensure no underline when disabled
                            //       },
                            //       '&:after': {
                            //         borderBottom: 'none' // Ensure no underline when focused
                            //       }
                            //     }
                            //   }
                            // }}
                          />
                        </FormField>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        TWO WAY AUDIO
                      </Typography>
                      <Card
                        variant="instavisionCardWithBorder"
                        sx={{ marginBottom: '20px' }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id="duplexing_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px'
                            }}
                          >
                            Type Of Duplexing
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="duplexing_label"
                            name="type_of_duplexing"
                            id="type_of_duplexing"
                            value={values.type_of_duplexing}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Type Of Duplexing'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                          >
                            <MenuItem value="Half Duplex">Half Duplex</MenuItem>
                            <MenuItem value="Full Duplex">Full Duplex</MenuItem>
                          </ModelFeatureSelect>
                        </FormControl>
                      </Card>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        Mounting
                      </Typography>
                      <Card
                        sx={{ marginBottom: '20px' }}
                        variant="instavisionCardWithBorder"
                      >
                        <FormField>
                          <FormControl fullWidth>
                            <InputLabel
                              id="mounting_label"
                              sx={{
                                top: '6px',
                                marginTop: '12px'
                              }}
                            >
                              Mounting Type
                            </InputLabel>
                            <ModelFeatureSelect
                              labelId="mounting_label"
                              name="type_of_mounting"
                              id="type_of_mounting"
                              value={values.type_of_mounting}
                              onChange={handleChange}
                              sx={{
                                // '& .MuiSelect-select span::before': {
                                //   content: "'Mounting Type'",
                                //   color: '#777'
                                // }
                                paddingTop: '12px'
                              }}
                            >
                              <MenuItem value="Wall">Wall</MenuItem>
                              <MenuItem value="Stand">Stand</MenuItem>
                              <MenuItem value="Bulb Spiral">
                                Bulb Spiral
                              </MenuItem>
                              <MenuItem value="Wall and Stand">
                                Wall and Stand
                              </MenuItem>
                              <MenuItem value="Ceiling">Ceiling</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </ModelFeatureSelect>
                          </FormControl>
                        </FormField>
                      </Card>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        PAN AND TILT
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="ptz_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.ptz
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            PTZ *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="ptz_label"
                            name="ptz"
                            id="ptz"
                            value={values.ptz}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'PTZ *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={touched.ptz && Boolean(errors.ptz)}
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.ptz && <ErrorBox>{errors?.ptz}</ErrorBox>}
                        </FormControl>
                        <FormField>
                          <ModelFormInput
                            id="pan_viewing_angle"
                            name="pan_viewing_angle"
                            label="Pan Viewing Angle"
                            placeholder="Pan Viewing Angle"
                            value={values.pan_viewing_angle}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormField>
                          <ModelFormInput
                            id="tilt_viewing_angle"
                            name="tilt_viewing_angle"
                            label="Tilt Viewing Angle"
                            placeholder="Tilt Viewing Angle"
                            value={values.tilt_viewing_angle}
                            onChange={handleChange}
                            type="text"
                            variant="standard"
                            fullWidth
                          />
                        </FormField>
                        <FormControl fullWidth>
                          <InputLabel
                            id="privacy_mode_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.privacy_mode
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Privacy Mode *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="privacy_mode_label"
                            name="privacy_mode"
                            id="privacy_mode"
                            value={values.privacy_mode}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Privacy Mode *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.privacy_mode &&
                              Boolean(errors.privacy_mode)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.privacy_mode && (
                            <ErrorBox>{errors?.privacy_mode}</ErrorBox>
                          )}
                        </FormControl>
                      </CardWithDivider>
                      <Divider
                        variant="middle"
                        sx={{
                          borderColor: 'dividerColor.main',
                          margin: '20px 0px'
                        }}
                      />
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        ACTIVITY ZONE
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="activity_zone_presence_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.activity_zone_presence
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Activity Zone Presence *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="activity_zone_presence_label"
                            name="activity_zone_presence"
                            id="activity_zone_presence"
                            value={values.activity_zone_presence}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Activity Zone Presence *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.activity_zone_presence &&
                              Boolean(errors.activity_zone_presence)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.activity_zone_presence && (
                            <ErrorBox>
                              {errors?.activity_zone_presence}
                            </ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="activity_zone_shape_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.activity_zone_shape
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Activity Zone Shape *
                          </InputLabel>

                          <ModelFeatureSelect
                            labelId="activity_zone_shape_label"
                            name="activity_zone_shape"
                            id="activity_zone_shape"
                            value={values.activity_zone_shape}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Activity Zone Shape *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.activity_zone_shape &&
                              Boolean(errors.activity_zone_shape)
                            }
                          >
                            <MenuItem value="Grid">Grid</MenuItem>
                            <MenuItem value="Polygon">Polygon</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.activity_zone_shape && (
                            <ErrorBox>{errors?.activity_zone_shape}</ErrorBox>
                          )}
                        </FormControl>
                        <FormField>
                          <ModelFormInput
                            id="number_of_zones"
                            name="number_of_zones"
                            label="Number of Zones *"
                            placeholder="Number of Zones"
                            value={values.number_of_zones}
                            onChange={handleChange}
                            type="number"
                            // required
                            error={
                              touched.number_of_zones &&
                              Boolean(errors.number_of_zones)
                            }
                            helperText={
                              touched.number_of_zones && errors.number_of_zones
                            }
                            fullWidth
                            variant="standard"
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                      </CardWithDivider>
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        AUDIO PROPERTIES
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="microphone_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.microphone
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Microphone *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="microphone_label"
                            name="microphone"
                            id="microphone"
                            value={values.microphone}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Microphone *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.microphone && Boolean(errors.microphone)
                            }
                          >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.microphone && (
                            <ErrorBox>{errors?.microphone}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="speaker_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.speaker
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Speaker *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="speaker_label"
                            name="speaker"
                            id="speaker"
                            value={values.speaker}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Speaker '",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={touched.speaker && Boolean(errors.speaker)}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.speaker && (
                            <ErrorBox>{errors?.speaker}</ErrorBox>
                          )}
                        </FormControl>
                      </CardWithDivider>

                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        IR PROPERTIES
                      </Typography>
                      <CardWithDivider style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="vision_mode_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.vision_mode
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            Night Vision / Light Mode *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="vision_mode_label"
                            name="vision_mode"
                            id="vision_mode"
                            value={values.vision_mode}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'Night Vision / Light Mode *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.vision_mode && Boolean(errors.vision_mode)
                            }
                          >
                            <MenuItem value="Light Mode">Light Mode</MenuItem>
                            <MenuItem value="Night Vision">
                              Night Vision
                            </MenuItem>
                            <MenuItem value="Light Mode and Night Vision">
                              Light Mode and Night Vision
                            </MenuItem>
                          </ModelFeatureSelect>
                          {errors?.vision_mode && (
                            <ErrorBox>{errors?.vision_mode}</ErrorBox>
                          )}
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel
                            id="white_light_label"
                            sx={{
                              top: '6px',
                              marginTop: '12px',
                              color: errors?.white_light
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }}
                          >
                            White Light *
                          </InputLabel>
                          <ModelFeatureSelect
                            labelId="white_light_label"
                            name="white_light"
                            id="white_light"
                            label="White Light"
                            value={values.white_light}
                            onChange={handleChange}
                            sx={{
                              // '& .MuiSelect-select span::before': {
                              //   content: "'White Light *'",
                              //   color: '#777'
                              // }
                              paddingTop: '12px'
                            }}
                            error={
                              touched.white_light && Boolean(errors.white_light)
                            }
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </ModelFeatureSelect>
                          {errors?.white_light && (
                            <ErrorBox>{errors?.white_light}</ErrorBox>
                          )}
                        </FormControl>
                        <FormField>
                          <ModelFormInput
                            id="number_of_leds"
                            name="number_of_leds"
                            placeholder="Number of LED's"
                            label="Number of LED's *"
                            value={values.number_of_leds}
                            onChange={handleChange}
                            type="number"
                            // required
                            error={
                              touched.number_of_leds &&
                              Boolean(errors.number_of_leds)
                            }
                            helperText={
                              touched.number_of_leds && errors.number_of_leds
                            }
                            fullWidth
                            variant="standard"
                            onFocus={(e) =>
                              e.target.addEventListener(
                                'wheel',
                                // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            onKeyDown={(evt) =>
                              ['e', 'E', '+', '-'].includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                        </FormField>
                        <FormField>
                          <FormControl fullWidth>
                            <ModelFormInput
                              id="night_vision_distance"
                              name="night_vision_distance"
                              placeholder="Night Vision Distance"
                              label="Night Vision Distance"
                              value={values.night_vision_distance}
                              onChange={handleChange}
                              type="number"
                              // required
                              error={
                                touched.night_vision_distance &&
                                Boolean(errors.night_vision_distance)
                              }
                              helperText={
                                touched.night_vision_distance &&
                                errors.night_vision_distance
                              }
                              fullWidth
                              variant="standard"
                              onFocus={(e) =>
                                e.target.addEventListener(
                                  'wheel',
                                  // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                                  function (e) {
                                    e.preventDefault();
                                  },
                                  { passive: false }
                                )
                              }
                              onKeyDown={(evt) =>
                                ['e', 'E', '+', '-'].includes(evt.key) &&
                                evt.preventDefault()
                              }
                            />
                          </FormControl>
                        </FormField>
                      </CardWithDivider>
                      {/* ===== */}
                      <Typography sx={{ marginBottom: '20px' }}>
                        INDICATOR LIGHT
                      </Typography>
                      <Card
                        variant="instavisionCardWithBorder"
                        sx={{ marginBottom: '20px' }}
                      >
                        <MultiSelectWithCheckbox
                          label="indicator_light"
                          id="indicator_light"
                          dataList={['Red', 'White', 'Green', 'Blue', 'None']}
                          value={values.indicator_light}
                          onChange={handleChange}
                          sx={{
                            '& .MuiSelect-select span::before': {
                              content: values.indicator_light?.length
                                ? "' '"
                                : "'Indicator Light *'",
                              color: errors?.indicator_light
                                ? '#d32f2f'
                                : '#rgba(0, 0, 0, 0.6)'
                            }
                          }}
                          error={
                            touched?.indicator_light &&
                            Boolean(errors?.indicator_light)
                          }
                        />
                        {errors?.indicator_light && (
                          <ErrorBox>{errors?.indicator_light}</ErrorBox>
                        )}
                      </Card>
                      <AddModelButton
                        label="Add Model"
                        isLoading={isAddingDeviceModelLoading}
                        handleClick={() => console.log('handleSubmit')}
                        type="submit"
                        sx={{ fontSize: '16px' }}
                        isDisabled={isAddingDeviceModelLoading}
                      >
                        Save
                      </AddModelButton>
                      <CancelButton
                        onClick={closeModal}
                        variant="text"
                        sx={{ fontSize: '16px' }}
                      >
                        Cancel
                      </CancelButton>
                      {/* </RightContainer> */}
                    </MainContainer>
                  </form>
                );
              }}
            </Formik>
          </>
        );
      case ADD_CAMERA_MODEL_STEPS.STEP_TWO:
        return (
          <div style={{ minWidth: '250px' }}>
            <Header>
              <Typography
                variant="h3"
                sx={{ fontWeight: '500', marginBottom: '20px 0px' }}
              >
                Step 2: Upload Device Files
              </Typography>
              {/* <CrossImage src={CrossIcon} alt="cross" onClick={closeModal} /> */}
            </Header>
            <ImageUpload
              photoUrl={photoUrl}
              openUploadImageModal={openUploadImageModal}
              isImageUploadLoading={isImageUploadLoading}
              previewImageUrl={previewImageUrl}
              handleOpenImageUploadModal={handleOpenImageModal}
              handleCloseImageUploadModal={handleCloseImageModal}
              handleImageFileUpload={handleImageFileUpload}
              handleImageUploadButtonClick={handleImageUploadButtonClick}
            />
            <UploadDatasheet
              dId={dId}
              setIsDatasheetUploaded={setIsDatasheetUploaded}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarOpen={setSnackbarOpen}
              setSeverity={setSeverity}
            />
            <CancelButton
              onClick={handleCloseSecondForm}
              variant="text"
              sx={{ fontSize: '16px' }}
              disabled={!(isImageUploaded && isDatasheetUploaded)}
            >
              Close
            </CancelButton>
          </div>
        );

      default:
        return <div>Nothing To Show </div>;
    }
  };
  return (
    <CoreModal open={openModal} onClose={closeModal}>
      {returnRelevantStep(currentStep)}
    </CoreModal>
  );
}

export default AddNewModel;
