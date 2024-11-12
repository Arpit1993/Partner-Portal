import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import {
  Typography,
  MenuItem,
  FormControl,
  Button as ButtonMui,
  InputLabel
} from '@mui/material';
import CardWithDivider from 'core-components/CardWithDivider';
import styled from 'styled-components';
import InstaTextField from 'core-components/TextField';
// import Input from 'core-components/Input';
import PlainSelect from 'core-components/PlainSelect';
import CrossIcon from 'assets/new-assets/cross.svg';
// import DeviceImage from 'assets/new-assets/device.svg';
import MultiSelectWithCheckbox from 'core-components/MultiSelectWithCheckbox';
import { IEditDeviceModelRequest } from 'types/request/zeus/deviceTypes';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { getBaseUrl, getItemFromLocalStorage, getOemAndUserId } from 'utils';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import { getPreSignedUrl, uploadTheAssetsToAmazon } from 'data/api/zeus';
import * as Yup from 'yup';
import UploadDatasheet from '../UploadDatasheet/index';

const EditModelButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

const FormField = styled('div')`
  width: 600px;
  padding: 12px;
`;

const ModelFormInput = styled(InstaTextField)`
  padding: 12px;
`;

const ModelFeatureSelect = styled(PlainSelect)`
  text-align: left;

  :selected {
    text-align: left;
  }
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

const LeftContainer = styled('aside')`
  flex-grow: 1;
  text-align: center;
  align-items: center;
  padding: 4px;
`;

const RightContainer = styled('section')`
  flex-grow: 2;
  padding: 4px;
  overflow-y: scroll;
  max-height: 83vh;
`;

const MainContainer = styled('div')`
  display: flex;
  gap: 16px;
`;

enum TYPE_OF_INPUT {
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  INPUT = 'input'
}

const ErrorBox = styled('p')`
  color: #d32f2f;
  font-size: 12px;
  padding-left: 16px;
  margin-bottom: 4px;
`;

interface ISubCategory {
  label: string; // used for name and id
  value: string[] | string | number | boolean; // value of feild
  placeholder: string; // name to display
  list: string[] | null; // if dropdown or multiselect then for options
  listValues: string[] | null | boolean[];
  type_of_input: TYPE_OF_INPUT;
  dataType: string;
  isRequired: boolean;
  // disableRequired?: boolean;
  // disableCondition?: boolean;
}

interface IEditModelFields {
  category: string;
  sub_category: ISubCategory[];
}

const ValidationSchema = Yup.object().shape({
  model_name: Yup.string().trim().required('Model Name required'),
  // chipset
  chipset_vendor: Yup.string().trim(),
  chipset_model: Yup.string().trim(),
  chipset_frequency: Yup.string().trim(),
  chipset_ram: Yup.number().min(0, 'Chipset RAM cannot be negative'),
  // Lens
  lens_type: Yup.string().trim(),
  viewing_angle: Yup.number(),
  focal_length: Yup.number(),
  number_of_lenses: Yup.number()
    .required('Number of Lenses required')
    .min(1, 'Number of Lenses must be at least 1'),
  // Image sensor
  image_sensor: Yup.string().trim(),
  lux_sensitivity: Yup.number(),
  // IR Property
  night_vision_distance: Yup.number(),
  white_light: Yup.string().required('White Light required'),
  vision_mode: Yup.string().required('Vision Mode required'),
  number_of_leds: Yup.number()
    .required('Number of LEDs required')
    .min(1, 'Number of LEDs must be at least 1'),

  // IndicatorLight
  indicator_light: Yup.array()
    .min(1, 'At least one indicator light is required')
    .required('Indicator Light is required'),

  // NightVision
  ir_led: Yup.string().trim().required('IR LED required'),
  ir_distance: Yup.string().trim().required('IR Distance required'),
  day_night_mode: Yup.string().trim().required('Day Night Mode required'),

  // Video
  video_compression: Yup.string(),
  image_resolution: Yup.string(),

  // Pan And Tilt
  ptz: Yup.string().required('Ptz required'),
  pan_viewing_angle: Yup.string(),
  tilt_viewing_angle: Yup.string(),
  privacy_mode: Yup.string().required('Privacy Mode required'),

  // Network
  wifi: Yup.string().required('Wifi required'),
  bluetooth: Yup.string().required('Bluetooth required'),
  wireless_security: Yup.string().required('Wireless Security required'),
  frequency: Yup.number()
    .required('Frequency is required')
    .min(1, 'Frequency needs to be at least 1'),

  // Activity Zone
  activity_zone_presence: Yup.string().required(
    'Activity Zone presence required'
  ),
  activity_zone_shape: Yup.string().required('Activity Zone shape required'),
  number_of_zones: Yup.number()
    .required('Number of zones required')
    .min(1, 'Number of zones must be at least 1'),

  // Power Specifications
  input_voltage: Yup.string().trim().required('Input Voltage required'),
  power_consumption: Yup.string().trim().required('Power consumption required'),
  power: Yup.string().required('Power required'),
  battery_capacity: Yup.string(),

  // Detection And tracking
  motion_detection: Yup.string().required('Motion Detection required'),
  motion_tracking: Yup.string().required('Motion Tracking required'),
  human_tracking: Yup.string().required('Human Tracking required'),
  animal_tracking: Yup.string().required('Animal Tracking required'),
  vehicle_tracking: Yup.string().required('Vehicle Tracking required'),

  // Audio
  audio_compression: Yup.string(),
  input_output: Yup.string(),

  // Audio Properties
  microphone: Yup.string().required('Microphone required'),
  speaker: Yup.string().required('Speaker required'),

  //  ISDCard
  sd_card_max_capacity: Yup.string(),
  sd_card_storage: Yup.string().trim().required('SD Card support required'),

  // TwoWayAudio
  type_of_duplexing: Yup.string(),

  // Mounting
  type_of_mounting: Yup.string(),

  // Reset
  reset: Yup.string()
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditDeviceModel(props: any) {
  const {
    openModal,
    closeModal,
    onEditButtonClick,
    deviceModelData,
    isEditingDeviceModelLoading
  } = props;

  const handleEditDeviceModelFormSubmit = (values: IEditDeviceModelRequest) => {
    onEditButtonClick(values);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [datasheetFile, setDatasheetFile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [imageFile, setImageFile] = useState<any>(null);
  const [openUploadImageModal, setOpenUploadImageModal] = useState(false);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [photoUrl, setPhotoUrl] = useState('');

  // const [openUploadDatasheetModal, setOpenUploadDatasheetModal] =
  //   useState(false);

  const handleOpenImageModal = () => {
    setOpenUploadImageModal(true);
  };

  const handleCloseImageModal = () => {
    setPreviewImageUrl(photoUrl);
    setImageFile(null);
    setOpenUploadImageModal(false);
  };

  const handleImageFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userSelectedFile = event.target.files?.[0];
    setImageFile(userSelectedFile);
  };

  const handleImageUploadButtonClick = async () => {
    setIsImageUploadLoading(true);
    try {
      if (imageFile) {
        setPreviewImageUrl(URL.createObjectURL(imageFile));
        // Here you would typically handle the file upload
      }
    } catch (error) {
      console.log('Error in uploading files');
      setImageFile(null);
    } finally {
      setIsImageUploadLoading(false);
      setOpenUploadImageModal(false);
    }
  };

  // const handleOpenDatasheetModal = () => {
  //   setOpenUploadImageModal(true);
  // };

  // const handleCloseDatasheetModal = () => {
  //   setDatasheetFile(null);
  //   setOpenUploadImageModal(false);
  // };

  const { oem_id } = getOemAndUserId();

  const InitialValues = {
    // Model Information
    model_name: deviceModelData?.model_name,

    // Chipset
    chipset_vendor: deviceModelData?.chipset?.vendor,
    chipset_model: deviceModelData.chipset?.model,
    chipset_frequency: deviceModelData?.chipset?.frequency,
    chipset_ram: deviceModelData?.chipset?.ram,

    // Lens
    lens_type: deviceModelData?.lens?.type,
    viewing_angle: deviceModelData?.lens?.viewing_angle,
    focal_length: deviceModelData?.lens?.focal_length,
    number_of_lenses: deviceModelData?.lens?.number_of_lenses,

    // Image sensor
    image_sensor: deviceModelData?.image_sensor?.type,
    lux_sensitivity: deviceModelData?.image_sensor?.lux_sensitivity,

    // IR Property
    vision_mode: deviceModelData?.ir_property?.vision_mode,
    white_light: deviceModelData?.ir_property?.white_light,
    number_of_leds: deviceModelData?.ir_property?.number_of_leds,
    night_vision_distance: deviceModelData?.ir_property?.night_vision_distance,

    // IndicatorLight
    indicator_light: deviceModelData?.indicator_light?.indicator_light,

    // NightVision
    ir_led: deviceModelData?.night_vision?.ir_led,
    ir_distance: deviceModelData?.night_vision?.ir_distance,
    day_night_mode: deviceModelData?.night_vision?.day_night_mode,

    // Video
    video_compression: deviceModelData?.video?.video_compression,
    image_resolution: deviceModelData?.video?.image_resolution,

    // Pan And Tilt
    ptz: deviceModelData?.pan_and_tilt?.ptz,
    pan_viewing_angle: deviceModelData?.pan_and_tilt?.pan_viewing_angle,
    tilt_viewing_angle: deviceModelData?.pan_and_tilt?.tilt_viewing_angle,
    privacy_mode: deviceModelData?.pan_and_tilt?.privacy_mode,

    // Network
    bluetooth: deviceModelData?.network?.bluetooth,
    wifi: deviceModelData?.network?.wifi,
    wireless_security: deviceModelData?.network?.wireless_security,
    frequency: deviceModelData?.network?.frequency,

    // Activity Zone
    activity_zone_presence:
      deviceModelData?.activity_zone?.activity_zone_presence,
    activity_zone_shape: deviceModelData?.activity_zone?.activity_zone_shape,
    number_of_zones: deviceModelData?.activity_zone?.number_of_zones,

    // Power Specifications
    input_voltage: deviceModelData?.power_specifications?.input_voltage,
    power_consumption: deviceModelData?.power_specifications?.power_consumption,
    power: deviceModelData?.power_specifications?.power,
    battery_capacity: deviceModelData?.power_specifications?.battery_capacity,

    // Detection And tracking
    motion_detection: deviceModelData?.detection_and_tracking?.motion_detection,
    motion_tracking: deviceModelData?.detection_and_tracking?.motion_tracking,
    human_tracking: deviceModelData?.detection_and_tracking?.human_tracking,
    animal_tracking: deviceModelData?.detection_and_tracking?.animal_tracking,
    vehicle_tracking: deviceModelData?.detection_and_tracking?.vehicle_tracking,

    // Audio
    audio_compression: deviceModelData?.audio?.audio_compression,
    input_output: deviceModelData?.audio?.input_output,

    // Audio Properties
    microphone: deviceModelData?.audio_properties?.microphone,
    speaker: deviceModelData?.audio_properties?.speaker,

    //  ISDCard
    sd_card_max_capacity: deviceModelData?.sd_card?.sd_card_max_capacity,
    sd_card_storage: deviceModelData?.sd_card?.sd_card_storage,

    // TwoWayAudio
    type_of_duplexing: deviceModelData?.two_way_audio?.type_of_duplexing,

    // Mounting
    type_of_mounting: deviceModelData?.mounting?.type_of_mounting,

    // Reset
    reset: deviceModelData?.reset?.reset

    // Status
    // status: deviceModelData.status

    // PhotoUrls
    // photo_urls: deviceModelData.photo_urls || ''

    // Datasheet
    // datasheet: deviceModelData.datasheet.datasheet || ''
  };

  // console.log('initial values', InitialValues);

  const getUploadDatasheetUrl = async (file: File) => {
    console.log('Datasheet uploaded. File:', file);
    try {
      const { name } = file;
      const extensionFile = name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}.${extensionFile}`;
      const type = 'datasheet';
      const { url } = await getPreSignedUrl(
        oem_id,
        deviceModelData?.id,
        type,
        fileName
      );
      await uploadTheAssetsToAmazon(url, file);
      const datasheetBaseUrl = getBaseUrl(url);
      console.log('datasheet Url after splitting', datasheetBaseUrl);
      return datasheetBaseUrl;
    } catch (error) {
      console.log('error', error);
      return deviceModelData?.datasheet_url;
    } finally {
      console.log('uploaded datasheet successfully');
    }
  };

  const getUploadImageUrl = async (file: File) => {
    setIsImageUploadLoading(true);
    try {
      const { name } = file;
      const extensionFile = name?.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}.${extensionFile}`;
      const type = 'image';
      const { url } = await getPreSignedUrl(
        oem_id,
        deviceModelData?.id,
        type,
        fileName
      );
      await uploadTheAssetsToAmazon(url, file);
      const imageBaseUrl = getBaseUrl(url);
      console.log('image Url after splitting', imageBaseUrl);
      return [imageBaseUrl];
    } catch (error) {
      console.log('error', error);
      return [deviceModelData?.photo_urls[0]];
    } finally {
      // setIsImageUploadLoading(false);
    }
  };

  const normalizeSpaces = (str: string) => str.replace(/\s+/g, ' ').trim();

  const formik = useFormik({
    initialValues: InitialValues,
    validationSchema: ValidationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      // console.log('Form submission reached onSubmit');
      // console.log('Validation Errors:', formik.errors);
      let photo_url;
      if (imageFile) {
        photo_url = await getUploadImageUrl(imageFile);
      }
      let deviceDatasheetUrl;
      if (datasheetFile) {
        deviceDatasheetUrl = await getUploadDatasheetUrl(datasheetFile);
      }
      const formattedValues: IEditDeviceModelRequest = {
        oem_id: getItemFromLocalStorage('oem_id'),
        model_name: normalizeSpaces(values.model_name),
        chipset: {
          vendor: normalizeSpaces(values.chipset_vendor),
          model: normalizeSpaces(values.chipset_model),
          frequency: normalizeSpaces(values.chipset_frequency),
          ram: Number(values.chipset_ram)
        },
        lens: {
          type: normalizeSpaces(values.lens_type),
          viewing_angle: Number(values.viewing_angle),
          focal_length: Number(values.focal_length),
          number_of_lenses: Number(values.number_of_lenses)
        },
        image_sensor: {
          type: normalizeSpaces(values.image_sensor),
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
          ir_led: normalizeSpaces(values.ir_led),
          ir_distance: normalizeSpaces(values.ir_distance),
          day_night_mode: values.day_night_mode
        },
        audio: {
          input_output: values.input_output,
          audio_compression: normalizeSpaces(values.audio_compression)
        },
        video: {
          video_compression: normalizeSpaces(values.video_compression),
          image_resolution: normalizeSpaces(values.image_resolution)
        },
        pan_and_tilt: {
          ptz: Boolean(values.ptz),
          pan_viewing_angle: normalizeSpaces(values.pan_viewing_angle),
          tilt_viewing_angle: normalizeSpaces(values.tilt_viewing_angle),
          privacy_mode: Boolean(values.privacy_mode)
        },
        network: {
          bluetooth: Boolean(values.bluetooth),
          wifi: values.wifi,
          wireless_security: String(values.wireless_security),
          frequency: Number(values.frequency)
        },
        reset: {
          reset: values.reset
        },
        // status: deviceModelData.status,
        activity_zone: {
          activity_zone_presence: Boolean(values.activity_zone_presence),
          activity_zone_shape: values.activity_zone_shape,
          number_of_zones: Number(values.number_of_zones)
        },
        power_specifications: {
          input_voltage: normalizeSpaces(values.input_voltage),
          power_consumption: normalizeSpaces(values.power_consumption),
          power: values.power,
          battery_capacity: normalizeSpaces(values.battery_capacity)
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
          sd_card_max_capacity: normalizeSpaces(values.sd_card_max_capacity),
          sd_card_storage: Boolean(values.sd_card_storage)
        },
        two_way_audio: {
          type_of_duplexing: values.type_of_duplexing
        },
        mounting: {
          type_of_mounting: values.type_of_mounting
        },
        ...(photo_url && { photo_urls: photo_url }), // Include photo_urls only if photo_url is present
        ...(deviceDatasheetUrl ? { datasheet: deviceDatasheetUrl } : {}) // Include datasheet only if datasheetUrl is present
      };

      console.log('formatted values', formattedValues);

      // Pass the formatted values to your submit handler
      handleEditDeviceModelFormSubmit(formattedValues);
      resetForm();
    }
  });
  // const handleManualSubmit = async () => {
  //   const errors = await formik.validateForm();
  //   console.log('Manual validation errors:', errors);
  //   formik.handleSubmit(); // To force submission if errors are clear
  // };
  const handleDatasheetUpload = (file: File) => {
    console.log('Datasheet', file);
    setDatasheetFile(file);
  };

  const EditModelFields: IEditModelFields[] = [
    {
      category: 'Model Information',
      sub_category: [
        {
          label: 'model_name',
          placeholder: 'Model Name *',
          value: formik.values.model_name,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        }
      ]
    },
    // Chipset
    {
      category: 'Chipset',
      sub_category: [
        {
          label: 'chipset_vendor',
          placeholder: 'Chipset Vendor',
          value: formik.values.chipset_vendor,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'chipset_model',
          placeholder: 'Chipset Model',
          value: formik.values.chipset_model,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'chipset_frequency',
          placeholder: 'Chipset Frequency',
          value: formik.values.chipset_frequency,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'text',
          isRequired: false
        },
        {
          label: 'chipset_ram',
          placeholder: 'Chipset RAM',
          value: formik.values.chipset_ram,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: false
        }
      ]
    },
    // Lens
    {
      category: 'Lens',
      sub_category: [
        {
          label: 'lens_type',
          placeholder: 'Lens Type',
          value: formik.values.lens_type,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'viewing_angle',
          placeholder: 'Viewing Angle',
          value: formik.values.viewing_angle,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: false
        },
        {
          label: 'focal_length',
          placeholder: 'Focal Length',
          value: formik.values.focal_length,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: false
        },
        {
          label: 'number_of_lenses',
          placeholder: 'Number of Lenses *',
          value: formik.values.number_of_lenses,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: true
        }
      ]
    },
    // Image Sensor
    {
      category: 'Image Sensor',
      sub_category: [
        {
          label: 'image_sensor',
          placeholder: 'Image Sensor',
          value: formik.values.image_sensor,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'lux_sensitivity',
          placeholder: 'Lux Sensitivity',
          value: formik.values.lux_sensitivity,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: false
        }
      ]
    },
    // IR Property
    {
      category: 'IR Property',
      sub_category: [
        {
          label: 'vision_mode',
          placeholder: 'Vision Mode *',
          value: formik.values.vision_mode,
          list: ['Light Mode', 'Night Vision', 'Light Mode and Night Vision'],
          listValues: [
            'Light Mode',
            'Night Vision',
            'Light Mode and Night Vision'
          ],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'white_light',
          placeholder: 'White Light *',
          value: formik.values.white_light,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'number_of_leds',
          placeholder: 'Number of LEDs *',
          value: formik.values.number_of_leds,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: true
        },
        {
          label: 'night_vision_distance',
          placeholder: 'Night Vision Distance',
          value: formik.values.night_vision_distance,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: false
        }
      ]
    },
    // Indicator Light
    {
      category: 'Indicator Light',
      sub_category: [
        {
          label: 'indicator_light',
          placeholder: formik.values.indicator_light?.length
            ? ''
            : 'Indicator Light *',
          value: formik.values.indicator_light,
          list: ['Red', 'White', 'Green', 'Blue', 'None'],
          listValues: ['Red', 'Blue', 'Green', 'Blue', 'None'],
          type_of_input: TYPE_OF_INPUT.CHECKBOX,
          dataType: 'string',
          isRequired: true
        }
      ]
    },
    // Night Vision
    {
      category: 'Night Vision',
      sub_category: [
        {
          label: 'ir_led',
          placeholder: 'IR LED *',
          value: formik.values.ir_led,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'ir_distance',
          placeholder: 'IR Distance *',
          value: formik.values.ir_distance,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'day_night_mode',
          placeholder: 'Day/Night Mode *',
          value: formik.values.day_night_mode,
          list: ['Night Vision', 'Light Mode', 'Light Mode and Night Vision'],
          listValues: [
            'Night Vision',
            'Light Mode',
            'Light Mode and Night Vision'
          ],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        }
      ]
    },
    // Video
    {
      category: 'Video',
      sub_category: [
        {
          label: 'video_compression',
          placeholder: 'Video Compression',
          value: formik.values.video_compression,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'image_resolution',
          placeholder: 'Image Resolution',
          value: formik.values.image_resolution,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        }
      ]
    },
    // Pan And Tilt
    {
      category: 'Pan And Tilt',
      sub_category: [
        {
          label: 'ptz',
          placeholder: 'PTZ *',
          value: formik.values.ptz,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'pan_viewing_angle',
          placeholder: 'Pan Viewing Angle',
          value: formik.values.pan_viewing_angle,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'tilt_viewing_angle',
          placeholder: 'Tilt Viewing Angle',
          value: formik.values.tilt_viewing_angle,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'privacy_mode',
          placeholder: 'Privacy Mode *',
          value: formik.values.privacy_mode,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        }
      ]
    },
    // Network
    {
      category: 'Network',
      sub_category: [
        {
          label: 'bluetooth',
          placeholder: 'Bluetooth *',
          value: formik.values.bluetooth,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'wifi',
          placeholder: 'WiFi *',
          value: formik.values.wifi,
          list: ['2.4 GHz', '2.4/5 GHz'],
          listValues: ['2.4 GHz', '2.4/5 GHz'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'wireless_security',
          placeholder: 'Wireless Security *',
          value: formik.values.wireless_security,
          list: [
            'WEP',
            'WPA',
            'WPA2',
            'WPA3',
            'WEP, WPA',
            'WEP, WPA2',
            'WEP, WPA3',
            'WPA, WPA2',
            'WPA, WPA3',
            'WPA2, WPA3',
            'WEP, WPA, WPA2',
            'WEP, WPA, WPA3',
            'WEP, WPA2, WPA3',
            'WPA, WPA2, WPA3',
            'WEP, WPA, WPA2, WPA3'
          ],
          listValues: [
            'WEP',
            'WPA',
            'WPA2',
            'WPA3',
            'WEP, WPA',
            'WEP, WPA2',
            'WEP, WPA3',
            'WPA, WPA2',
            'WPA, WPA3',
            'WPA2, WPA3',
            'WEP, WPA, WPA2',
            'WEP, WPA, WPA3',
            'WEP, WPA2, WPA3',
            'WPA, WPA2, WPA3',
            'WEP, WPA, WPA2, WPA3'
          ],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'frequency',
          placeholder: 'Frequency *',
          value: formik.values.frequency,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: true
        }
      ]
    },
    // Activity Zone
    {
      category: 'Activity Zone',
      sub_category: [
        {
          label: 'activity_zone_presence',
          placeholder: 'Activity Zone Presence *',
          value: formik.values.activity_zone_presence,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'activity_zone_shape',
          placeholder: 'Activity Zone Shape *',
          value: formik.values.activity_zone_shape,
          list: ['Grid', 'Polygon'],
          listValues: ['Grid', 'Polygon'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'number_of_zones',
          placeholder: 'Number of Zones *',
          value: formik.values.number_of_zones,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'number',
          isRequired: true
        }
      ]
    },
    // Power Specifications
    {
      category: 'Power Specifications',
      sub_category: [
        {
          label: 'input_voltage',
          placeholder: 'Input Voltage *',
          value: formik.values.input_voltage,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'power_consumption',
          placeholder: 'Power Consumption *',
          value: formik.values.power_consumption,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'power',
          placeholder: 'Power: AC/Battery *',
          value: formik.values.power,
          list: ['AC', 'Battery', 'AC and Battery'],
          listValues: ['AC', 'Battery', 'AC and Battery'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'battery_capacity',
          placeholder: 'Battery Capacity',
          value: formik.values.battery_capacity,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
          // disableRequired: true,
          // disableCondition: formik.values.power === 'AC'
        }
      ]
    },
    // Detection And Tracking
    {
      category: 'Detection And Tracking',
      sub_category: [
        {
          label: 'motion_detection',
          placeholder: 'Motion Detection *',
          value: formik.values.motion_detection,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'motion_tracking',
          placeholder: 'Motion Tracking *',
          value: formik.values.motion_tracking,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'human_tracking',
          placeholder: 'Human Tracking *',
          value: formik.values.human_tracking,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'animal_tracking',
          placeholder: 'Animal Tracking *',
          value: formik.values.animal_tracking,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'vehicle_tracking',
          placeholder: 'Vehicel Tracking *',
          value: formik.values.vehicle_tracking,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        }
      ]
    },
    // Audio
    {
      category: 'Audio',
      sub_category: [
        {
          label: 'input_output',
          placeholder: 'Input/Output',
          value: formik.values.input_output,
          list: ['Input', 'Output', 'Input and Output'],
          listValues: ['Input', 'Output', 'Input and Output'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'audio_compression',
          placeholder: 'Audio Compression',
          value: formik.values.audio_compression,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        }
      ]
    },
    // Audio Properties
    {
      category: 'Audio Properties',
      sub_category: [
        {
          label: 'microphone',
          placeholder: 'Microphone *',
          value: formik.values.microphone,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'speaker',
          placeholder: 'Speaker *',
          value: formik.values.speaker,
          list: ['Yes', 'No'],
          listValues: ['Yes', 'No'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        }
      ]
    },
    // SD Card
    {
      category: 'SD Card',
      sub_category: [
        {
          label: 'sd_card_storage',
          placeholder: 'SD Card Support *',
          value: formik.values.sd_card_storage,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'sd_card_max_capacity',
          placeholder: 'SD Card Max Capacity',
          value: formik.values.sd_card_max_capacity,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
          // disableRequired: true,
          // disableCondition: formik.values.sd_card_storage === 'false'
        }
      ]
    },
    // Two-Way Audio
    {
      category: 'Two-Way Audio',
      sub_category: [
        {
          label: 'type_of_duplexing',
          placeholder: 'Type of Duplexing',
          value: formik.values.type_of_duplexing,
          list: ['Half Duplex', 'Full Duplex'],
          listValues: ['Half Duplex', 'Full Duplex'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        }
      ]
    },
    // Mounting
    {
      category: 'Mounting',
      sub_category: [
        {
          label: 'type_of_mounting',
          placeholder: 'Type of Mounting',
          value: formik.values.type_of_mounting,
          list: [
            'Wall',
            'Stand',
            'Bulb Spiral',
            'Wall and Stand',
            'Ceiling',
            'Other'
          ],
          listValues: [
            'Wall',
            'Stand',
            'Bulb Spiral',
            'Wall and Stand',
            'Ceiling',
            'Other'
          ],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        }
      ]
    },
    // Reset
    {
      category: 'Reset',
      sub_category: [
        {
          label: 'reset',
          placeholder: 'Hardware Reset',
          value: formik.values.reset,
          list: ['Yes', 'No'],
          listValues: ['Yes', 'No'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        }
      ]
    }
  ];

  const renderEditForm = () => {
    return EditModelFields.map((item: IEditModelFields) => (
      <div key={item?.category}>
        <Typography
          variant="h4"
          sx={{ marginBottom: '24px', fontWeight: '600' }}
        >
          {item.category}
        </Typography>
        <CardWithDivider sx={{ marginBottom: '24px', overflow: 'visible' }}>
          {item.sub_category.map((subDetail: ISubCategory) => (
            <React.Fragment key={subDetail.label}>
              {subDetail.type_of_input === 'input' && (
                <FormField>
                  <ModelFormInput
                    name={subDetail.label}
                    id={subDetail.label}
                    label={subDetail.placeholder}
                    placeholder={subDetail.placeholder}
                    value={subDetail.value}
                    // value={
                    //   subDetail.disableRequired && subDetail.disableCondition
                    //     ? ''
                    //     : subDetail.value
                    // }
                    onChange={formik.handleChange}
                    type={subDetail.dataType}
                    onKeyDown={(e) => {
                      if (subDetail.dataType === 'number') {
                        // Prevent non-numeric input (like 'e', 'E', '+', '-', and '.')
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }
                    }}
                    error={
                      !!(
                        formik.touched[
                          subDetail.label as keyof typeof formik.touched
                        ] &&
                        formik.errors[
                          subDetail.label as keyof typeof formik.errors
                        ]
                      )
                    }
                    helperText={
                      formik.touched[
                        subDetail.label as keyof typeof formik.touched
                      ] &&
                      typeof formik.errors[
                        subDetail.label as keyof typeof formik.errors
                      ] === 'string'
                        ? (formik.errors[
                            subDetail.label as keyof typeof formik.errors
                          ] as string)
                        : ''
                    }
                    variant="standard"
                    fullWidth
                    // disabled={
                    //   subDetail.disableRequired
                    //     ? subDetail.disableCondition
                    //     : false
                    // }
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
                    onFocus={(e) => {
                      if (subDetail.dataType === 'number') {
                        e.target.addEventListener(
                          'wheel',
                          // eslint-disable-next-line @typescript-eslint/no-shadow, func-names
                          function (e) {
                            e.preventDefault();
                          },
                          { passive: false }
                        );
                      }
                    }}
                  />
                </FormField>
              )}
              {subDetail.type_of_input === 'dropdown' && (
                <FormControl fullWidth>
                  <InputLabel
                    id={`${subDetail.label}-label`}
                    sx={{
                      top: '6px',
                      marginTop: '12px',
                      color: formik.errors?.[
                        subDetail.label as keyof typeof formik.errors
                      ]
                        ? '#d32f2f'
                        : 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {subDetail.placeholder}
                  </InputLabel>
                  <ModelFeatureSelect
                    labelId={`${subDetail.label}-label`}
                    name={subDetail.label}
                    id={subDetail.label}
                    value={subDetail.value}
                    onChange={formik.handleChange}
                    sx={{
                      // '& .MuiSelect-select span::before': {
                      //   content: `"${subDetail.placeholder}"`,
                      //   color: 'text.body'
                      // },
                      paddingTop: '12px'
                    }}
                    // required={subDetail.isRequired}
                    error={
                      !!(
                        formik.touched[
                          subDetail.label as keyof typeof formik.touched
                        ] &&
                        formik.errors[
                          subDetail.label as keyof typeof formik.errors
                        ]
                      )
                    }
                  >
                    {subDetail.list &&
                      subDetail.list.map(
                        (option: string | number, index: number) => (
                          <MenuItem
                            key={option}
                            value={
                              subDetail.listValues
                                ? (subDetail.listValues[index] as
                                    | string
                                    | number)
                                : option
                            }
                          >
                            {option}
                          </MenuItem>
                        )
                      )}
                  </ModelFeatureSelect>
                  {formik.errors?.[
                    subDetail.label as keyof typeof formik.errors
                  ] &&
                    typeof formik.errors[
                      subDetail.label as keyof typeof formik.errors
                    ] === 'string' && (
                      <ErrorBox>
                        {String(
                          formik.errors[
                            subDetail.label as keyof typeof formik.errors
                          ]
                        )}
                      </ErrorBox>
                    )}
                </FormControl>
              )}
              {subDetail.type_of_input === 'checkbox' &&
                subDetail.list !== null && (
                  <FormControl fullWidth>
                    <MultiSelectWithCheckbox
                      id={subDetail.label}
                      name={subDetail.label}
                      label={subDetail.placeholder}
                      dataList={subDetail.list}
                      sx={{
                        '& .MuiSelect-select span::before': {
                          content: `"${subDetail.placeholder}"`,
                          color: formik.errors?.indicator_light
                            ? '#d32f2f'
                            : 'rgba(0, 0, 0, 0.6)' // Corrected to remove the `#`
                        }
                      }}
                      error={
                        subDetail.isRequired
                          ? !!(
                              formik.touched[
                                subDetail.label as keyof typeof formik.touched
                              ] &&
                              formik.errors[
                                subDetail.label as keyof typeof formik.errors
                              ]
                            )
                          : false
                      }
                      // required={subDetail.isRequired}
                      value={subDetail.value}
                      onChange={formik.handleChange}
                      style={{ margin: '0' }}
                    />
                    {formik.errors?.[
                      subDetail.label as keyof typeof formik.errors
                    ] &&
                      typeof formik.errors[
                        subDetail.label as keyof typeof formik.errors
                      ] === 'string' && (
                        <ErrorBox>
                          {String(
                            formik.errors[
                              subDetail.label as keyof typeof formik.errors
                            ]
                          )}
                        </ErrorBox>
                      )}
                  </FormControl>
                )}
            </React.Fragment>
          ))}
        </CardWithDivider>
      </div>
    ));
  };

  return (
    <CoreModal open={openModal} onClose={closeModal}>
      <>
        <Header>
          <Typography
            variant="h3"
            sx={{ fontWeight: '500', marginBottom: '20px 0px' }}
          >
            Edit Model
          </Typography>
          <CrossImage src={CrossIcon} alt="cross" onClick={closeModal} />
        </Header>

        <form onSubmit={formik.handleSubmit}>
          <MainContainer>
            <LeftContainer>
              <ImageUpload
                photoUrl={
                  deviceModelData?.photo_urls !== null &&
                  deviceModelData?.photo_urls[0]
                }
                openUploadImageModal={openUploadImageModal}
                isImageUploadLoading={isImageUploadLoading}
                previewImageUrl={previewImageUrl}
                handleOpenImageUploadModal={handleOpenImageModal}
                handleCloseImageUploadModal={handleCloseImageModal}
                handleImageFileUpload={handleImageFileUpload}
                handleImageUploadButtonClick={handleImageUploadButtonClick}
              />
              <UploadDatasheet
                onDatasheetUpload={handleDatasheetUpload}
                datasheetUrl={deviceModelData?.datasheet_url}
              />
            </LeftContainer>
            <RightContainer>
              {renderEditForm()}
              <EditModelButton
                label="Edit"
                // handleClick={handleManualSubmit}
                type="submit"
                sx={{ fontSize: '16px' }}
                disabled={isEditingDeviceModelLoading}
              >
                Save
              </EditModelButton>
              <CancelButton
                onClick={closeModal}
                variant="text"
                sx={{ fontSize: '16px' }}
              >
                Cancel
              </CancelButton>
            </RightContainer>
          </MainContainer>
        </form>
      </>
    </CoreModal>
  );
}

export default EditDeviceModel;
