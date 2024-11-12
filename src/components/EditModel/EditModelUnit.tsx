import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import {
  Typography,
  MenuItem,
  FormControl,
  Button as ButtonMui,
  InputLabel,
  InputAdornment
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
import UploadDatasheet from '../UploadDatasheet/index';
// import ValidationSchema from './ValidationSchema';

const EditModelButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

const ModelFormInput = styled(InstaTextField)``;

const ModelFeatureSelect = styled(PlainSelect)`
  text-align: left;

  :selected {
    text-align: left;
  }
`;

const FormControlField = styled(FormControl)`
  box-sizing: border-box;
  width: 100%;
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
  width: 600px;
`;

const MainContainer = styled('div')`
  display: flex;
  gap: 16px;
`;

enum TYPE_OF_INPUT {
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  INPUT = 'input',
  // INPUT_WITH_UNIT = 'input_with_unit',
  INPUT_WITH_SELECT_ADORNMENT = 'input_with_select_adornment'
}

interface ISubCategory {
  label: string; // used for name and id
  value: string[] | string | number | boolean; // value of field
  placeholder: string; // name to display
  list: string[] | null; // if dropdown or multiselect then for options
  listValues: string[] | null | boolean[] | number[]; // listValues if different from list
  type_of_input: TYPE_OF_INPUT; // input type (e.g., input, dropdown, checkbox)
  dataType: string; // field data type (e.g., string, number)
  isRequired: boolean; // field required or not
  unitDetails?: ISubCategoryUnit;
  // New properties
  // adornment?: string; // Static adornment value (like 'W', 'kg')
  // unit?: string[]; // Captures the selected unit if the adornment is a select dropdown
  // unit_label?: string;
  // unit_value?: string;
}

interface ISubCategoryUnit {
  unit: string[];
  unit_label: string;
  unit_value: string;
}

interface IEditModelFields {
  category: string;
  sub_category: ISubCategory[];
}

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
  // const [datasheetUrl, setDatasheetUrl] = useState('');

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

  const { oem_id } = getOemAndUserId();

  const InitialValues = {
    // Model Information
    model_name: deviceModelData.model_name,
    product_type: deviceModelData.product_type,

    // Chipset
    chipset_vendor: deviceModelData.chipset.vendor,
    chipset_model: deviceModelData.chipset.model,
    chipset_frequency: deviceModelData.chipset.frequency,
    chipset_frequency_unit: 'GHz',
    chipset_ram: deviceModelData.chipset.ram,
    chipset_ram_unit: 'MB',

    // Lens
    lens_type: deviceModelData.lens.type,
    viewing_angle: deviceModelData.lens.viewing_angle,
    viewing_angle_unit: 'degree',
    focal_length: deviceModelData.lens.focal_length,
    focal_length_unit: 'mm',
    number_of_lenses: deviceModelData.lens.number_of_lenses,

    // Image sensor
    image_sensor: deviceModelData.image_sensor.type,
    lux_sensitivity: deviceModelData.image_sensor.lux_sensitivity,
    lux_sensitivity_unit: 'lux',

    // IR Property
    vision_mode: deviceModelData.ir_property.vision_mode,
    white_light: deviceModelData.ir_property.white_light,
    number_of_leds: deviceModelData.ir_property.number_of_leds,
    night_vision_distance: deviceModelData.ir_property.night_vision_distance,
    night_vision_distance_unit: 'Metre',

    // IndicatorLight
    indicator_light: deviceModelData?.indicator_light?.indicator_light,

    // NightVision
    ir_led: deviceModelData.night_vision.ir_led,
    ir_distance: deviceModelData.night_vision.ir_distance,
    ir_distance_unit: 'Metre',
    day_night_mode: deviceModelData.night_vision.day_night_mode,

    // Video
    video_compression: deviceModelData.video.video_compression,
    image_resolution: deviceModelData.video.image_resolution,

    // Pan And Tilt
    ptz: deviceModelData.pan_and_tilt.ptz || '',
    pan_viewing_angle: deviceModelData.pan_and_tilt.pan_viewing_angle,
    pan_viewing_angle_unit: 'degree',
    tilt_viewing_angle: deviceModelData.pan_and_tilt.tilt_viewing_angle,
    tilt_viewing_angle_unit: 'degree',
    privacy_mode: deviceModelData.pan_and_tilt.privacy_mode,

    // Network
    bluetooth: deviceModelData.network.bluetooth,
    wifi: deviceModelData.network.wifi,
    wireless_security: deviceModelData.network.wireless_security,
    frequency: deviceModelData.network.frequency,
    frequency_unit: 'GHz',

    // Activity Zone
    activity_zone_presence:
      deviceModelData.activity_zone.activity_zone_presence,
    activity_zone_shape: deviceModelData.activity_zone.activity_zone_shape,
    number_of_zones: deviceModelData.activity_zone.number_of_zones,

    // Power Specifications
    input_voltage: deviceModelData.power_specifications.input_voltage,
    input_voltage_unit: 'Volt',
    power_consumption: deviceModelData.power_specifications.power_consumption,
    power_consumption_unit: 'Watt',
    power: deviceModelData.power_specifications.power,
    battery_capacity: deviceModelData.power_specifications.battery_capacity,
    battery_capacity_unit: 'mAh',

    // Detection And tracking
    motion_detection: deviceModelData.detection_and_tracking.motion_detection,
    motion_tracking: deviceModelData.detection_and_tracking.motion_tracking,
    human_tracking: deviceModelData.detection_and_tracking.human_tracking,
    animal_tracking: deviceModelData.detection_and_tracking.animal_tracking,
    vehicle_tracking: deviceModelData.detection_and_tracking.vehicle_tracking,

    // Audio
    audio_compression: deviceModelData.audio.audio_compression,
    input_output: deviceModelData.audio.input_output,

    // Audio Properties
    microphone: deviceModelData.audio_properties.microphone,
    speaker: deviceModelData.audio_properties.speaker,

    //  ISDCard
    sd_card_max_capacity: deviceModelData.sd_card.sd_card_max_capacity,
    sd_card_max_capacity_unit: 'GB',
    sd_card_storage: deviceModelData.sd_card.sd_card_storage,

    // TwoWayAudio
    type_of_duplexing: deviceModelData.two_way_audio.type_of_duplexing,

    // Mounting
    type_of_mounting: deviceModelData.mounting.type_of_mounting,

    // Reset
    reset: deviceModelData.reset.reset

    // Status
    // status: deviceModelData.status.status

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
        deviceModelData.id,
        type,
        fileName
      );
      await uploadTheAssetsToAmazon(url, file);
      const datasheetBaseUrl = getBaseUrl(url);
      // setDatasheetUrl(datasheetBaseUrl);
      console.log('datasheet Url after splitting', datasheetBaseUrl);
      return datasheetBaseUrl;
    } catch (error) {
      console.log('error', error);
      // setDatasheetUrl(deviceModelData.datasheet);
    } finally {
      console.log('uploaded datasheet successfully');
    }
    return null;
  };

  const getUploadImageUrl = async (file: File) => {
    try {
      const { name } = file;
      const extensionFile = name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}.${extensionFile}`;
      const type = 'image';
      const { url } = await getPreSignedUrl(
        oem_id,
        deviceModelData.id,
        type,
        fileName
      );
      await uploadTheAssetsToAmazon(url, file);
      const imageBaseUrl = getBaseUrl(url);
      console.log('image Url after splitting', imageBaseUrl);
      return [imageBaseUrl];
    } catch (error) {
      console.log('error', error);
      return [deviceModelData.photo_urls[0]];
    }
  };

  const formik = useFormik({
    initialValues: InitialValues,
    // validationSchema: ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
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
        model_name: values.model_name,
        chipset: {
          vendor: values.chipset_vendor,
          model: values.chipset_model,
          frequency: values.chipset_frequency,
          ram: values.chipset_ram
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
        // status: values.status,
        activity_zone: {
          activity_zone_presence: Boolean(values.activity_zone_presence),
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
        ...(photo_url && { photo_urls: photo_url }), // Include photo_urls only if photo_url is present
        ...(deviceDatasheetUrl ? { datasheet: deviceDatasheetUrl } : {}) // Include datasheet only if datasheetUrl is present
      };

      // Pass the formatted values to your submit handler
      handleEditDeviceModelFormSubmit(formattedValues);
      resetForm();
      console.log('device details after resetting', deviceModelData);
    }
  });

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
          placeholder: 'Model Name',
          value: formik.values.model_name,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'product_type',
          placeholder: 'Model Category *',
          value: formik.values.product_type,
          list: ['Home Security', 'Baby'],
          listValues: ['HomeSecurity', 'Baby'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
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
          list: ['ANYKYA', 'Junzheng'],
          listValues: ['ANYKYA', 'Junzheng'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'chipset_model',
          placeholder: 'Chipset Model',
          value: formik.values.chipset_model,
          list: ['AK3918EV330L', 'T23N'],
          listValues: ['AK3918EV330L', 'T23N'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'chipset_frequency',
          placeholder: 'Chipset Frequency',
          value: formik.values.chipset_frequency,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'text',
          isRequired: false,
          unitDetails: {
            unit_label: 'chipset_frequency_unit',
            unit: ['GHz', 'MHz'],
            unit_value: formik.values.chipset_frequency_unit
          }
        },
        {
          label: 'chipset_ram',
          placeholder: 'Chipset Ram',
          value: formik.values.chipset_ram,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'number',
          isRequired: false,
          unitDetails: {
            unit: ['MB', 'GB'],
            unit_value: formik.values.chipset_ram_unit,
            unit_label: 'chipset_ram_unit'
          }
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
          list: ['Fixed or Prime'],
          listValues: ['Fixed or Prime'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'viewing_angle',
          placeholder: 'Viewing Angle',
          value: formik.values.viewing_angle,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'number',
          isRequired: false,
          unitDetails: {
            unit_label: 'viewing_angle_unit',
            unit: ['degree'],
            unit_value: formik.values.viewing_angle_unit
          }
        },
        {
          label: 'focal_length',
          placeholder: 'Focal Length',
          value: formik.values.focal_length,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'number',
          isRequired: true,
          unitDetails: {
            unit: ['mm'],
            unit_value: formik.values.focal_length_unit,
            unit_label: 'focal_length_unit'
          }
        },
        {
          label: 'number_of_lenses',
          placeholder: 'Number of Lenses',
          value: formik.values.number_of_lenses,
          list: ['1', '2'],
          listValues: [1, 2],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
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
          placeholder: 'Image Sensor Type',
          value: formik.values.image_sensor,
          list: ['CV2003', 'GC1084'],
          listValues: ['CV2003', 'GC1084'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'lux_sensitivity',
          placeholder: 'Lux Sensitivity',
          value: formik.values.lux_sensitivity,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'number',
          isRequired: false,
          unitDetails: {
            unit: ['lux'],
            unit_label: 'lux_sensitivity_unit',
            unit_value: formik.values.lux_sensitivity_unit
          }
        }
      ]
    },
    // IR Property
    {
      category: 'IR Property',
      sub_category: [
        {
          label: 'vision_mode',
          placeholder: 'Vision Mode',
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
          placeholder: 'Number of LEDs',
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
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'number',
          isRequired: true,
          unitDetails: {
            unit: ['Metre'],
            unit_label: 'night_vision_distance_unit',
            unit_value: formik.values.night_vision_distance_unit
          }
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
          placeholder: 'IR LED',
          value: formik.values.ir_led,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: true
        },
        {
          label: 'ir_distance',
          placeholder: 'IR Distance',
          value: formik.values.ir_distance,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: true,
          unitDetails: {
            unit: ['Metre'],
            unit_label: 'ir_distance_unit',
            unit_value: formik.values.ir_distance_unit
          }
        },
        {
          label: 'day_night_mode',
          placeholder: 'Day/Night Mode',
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
          list: ['H265'],
          listValues: ['H265'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'image_resolution',
          placeholder: 'Image Resolution',
          value: formik.values.image_resolution,
          list: ['720p', '1080p', '2K', '4K', '8K'],
          listValues: ['720p', '1080p', '2K', '4K', '8K'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
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
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: false,
          unitDetails: {
            unit: ['degree'],
            unit_label: 'pan_viewing_angle',
            unit_value: formik.values.pan_viewing_angle_unit
          }
        },
        {
          label: 'tilt_viewing_angle',
          placeholder: 'Tilt Viewing Angle',
          value: formik.values.tilt_viewing_angle,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: false,
          unitDetails: {
            unit: ['degree'],
            unit_label: 'tilt_viewing_angle',
            unit_value: formik.values.tilt_viewing_angle_unit
          }
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
          placeholder: 'Wireless Security',
          value: formik.values.wireless_security,
          list: ['WEP', 'WPA', 'WPA2', 'WPA3'],
          listValues: ['wep', 'wpa', 'wpa2', 'wpa3'],
          type_of_input: TYPE_OF_INPUT.INPUT,
          dataType: 'string',
          isRequired: false
        },
        {
          label: 'frequency',
          placeholder: 'Frequency *',
          value: formik.values.frequency,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'number',
          isRequired: true,
          unitDetails: {
            unit_label: 'frequency_unit',
            unit: ['GHz', 'MHz'],
            unit_value: formik.values.frequency_unit
          }
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
          placeholder: 'Input Voltage',
          value: formik.values.input_voltage,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: true,
          unitDetails: {
            unit: ['Volt'],
            unit_label: 'input_voltage_unit',
            unit_value: formik.values.input_voltage_unit
          }
        },
        {
          label: 'power_consumption',
          placeholder: 'Power Consumption',
          value: formik.values.power_consumption,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: true,
          unitDetails: {
            unit: ['Watt'],
            unit_label: 'power_consumption_unit',
            unit_value: formik.values.power_consumption_unit
          }
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
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: false,
          unitDetails: {
            unit: ['mAh'],
            unit_label: 'battery_capacity_unit',
            unit_value: formik.values.battery_capacity_unit
          }
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
          list: ['PCM', 'G.711'],
          listValues: ['PCM', 'G.711'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
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
          label: 'sd_card_max_capacity',
          placeholder: 'SD Card Max Capacity',
          value: formik.values.sd_card_max_capacity,
          list: null,
          listValues: null,
          type_of_input: TYPE_OF_INPUT.INPUT_WITH_SELECT_ADORNMENT,
          dataType: 'string',
          isRequired: false,
          unitDetails: {
            unit_label: 'sd_card_max_capacity_unit',
            unit: ['GB'],
            unit_value: formik.values.sd_card_max_capacity_unit
          }
        },
        {
          label: 'sd_card_storage',
          placeholder: 'SD Card Support *',
          value: formik.values.sd_card_storage,
          list: ['Yes', 'No'],
          listValues: ['true', 'false'],
          type_of_input: TYPE_OF_INPUT.DROPDOWN,
          dataType: 'string',
          isRequired: true
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
          placeholder: 'Reset',
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
      <div key={item.category}>
        <Typography
          variant="h4"
          sx={{ marginBottom: '24px', fontWeight: '600' }}
        >
          {item.category}
        </Typography>
        <CardWithDivider sx={{ marginBottom: '24px' }}>
          {item.sub_category.map((subDetail: ISubCategory) => (
            <React.Fragment key={subDetail.label}>
              {subDetail.type_of_input === 'input' && (
                <FormControlField style={{ padding: '12px' }}>
                  <ModelFormInput
                    name={subDetail.label}
                    id={subDetail.label}
                    label={subDetail.placeholder}
                    placeholder={subDetail.placeholder}
                    value={
                      formik.values[
                        subDetail.label as keyof typeof formik.values
                      ]
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={subDetail.dataType}
                    required={subDetail.isRequired}
                    variant="standard"
                  />
                </FormControlField>
              )}

              {subDetail.type_of_input === 'dropdown' && (
                <FormControlField style={{ padding: '12px' }}>
                  <InputLabel
                    id={`${subDetail.label}-label`}
                    sx={{
                      top: '6px',
                      marginTop: '12px',
                      marginLeft: '12px'
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
                      paddingTop: '12px'
                    }}
                    required={subDetail.isRequired}
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
                </FormControlField>
              )}
              {subDetail.type_of_input === 'checkbox' &&
                subDetail.list !== null && (
                  <FormControlField style={{ padding: '12px' }}>
                    <MultiSelectWithCheckbox
                      id={subDetail.label}
                      name={subDetail.label}
                      label={subDetail.placeholder}
                      dataList={subDetail.list}
                      sx={{
                        '& .MuiSelect-select span::before': {
                          content: `"${subDetail.placeholder}"`,
                          color: 'text.body'
                        }
                      }}
                      required={subDetail.isRequired}
                      value={subDetail.value}
                      onChange={formik.handleChange}
                      style={{ margin: '0' }}
                    />
                  </FormControlField>
                )}
              {/* Input with Right-side Unit Adornment */}
              {/* {subDetail.type_of_input === 'input_with_unit' && (
                <FormControlField style={{ padding: '12px' }}>
                  <ModelFormInput
                    name={subDetail.label}
                    id={subDetail.label}
                    label={subDetail.placeholder}
                    placeholder={subDetail.placeholder}
                    value={
                      formik.values[
                        subDetail.label as keyof typeof formik.values
                      ]
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={subDetail.dataType}
                    required={subDetail.isRequired}
                    variant="standard"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {subDetail.adornment}
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControlField>
              )} */}

              {/* Input with Select Option Adornment */}
              {subDetail.type_of_input === 'input_with_select_adornment' && (
                <FormControlField style={{ padding: '12px' }}>
                  <ModelFormInput
                    name={subDetail.label}
                    label={subDetail.placeholder}
                    value={subDetail.value}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={subDetail.placeholder}
                    variant="standard"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <PlainSelect
                            name={subDetail.unitDetails?.unit_label}
                            label={subDetail.unitDetails?.unit_label}
                            value={subDetail.unitDetails?.unit_value}
                            onChange={formik.handleChange}
                            sx={{ marginRight: '12px' }}
                          >
                            {subDetail.unitDetails &&
                              subDetail.unitDetails.unit.map((unit) => (
                                <MenuItem key={unit} value={unit}>
                                  {unit}
                                </MenuItem>
                              ))}
                          </PlainSelect>
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControlField>
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
                  deviceModelData.photo_urls !== null &&
                  deviceModelData.photo_urls[0]
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
                datasheetUrl={deviceModelData.datasheet_url}
              />
            </LeftContainer>
            <RightContainer>
              {renderEditForm()}
              <EditModelButton
                label="Edit"
                handleClick={() => console.log('handleSubmit')}
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
