import { useState } from 'react';
import Button from 'core-components/Button';
import { AlertColor } from '@mui/material';
import styled from 'styled-components';

import { getBaseUrl, getOemAndUserId, isEngineering } from 'utils';
import {
  createEngineeringDeviceFirmwares,
  createProductionDeviceFirmwares,
  // getPreSignedUrl,
  getPreSignedUrlForFirmware,
  uploadTheAssetsToAmazon
} from 'data/api/zeus';
import { IUploadFirmwareRequest } from 'types/request/zeus/firmwareTypes';
import InstaSnackBar from 'components/SnackBar';
// import { DEVICE_MODEL_STATUS } from 'enums';
import UploadFirmwareDialogue from './UploadFirmwareDialogue';

const UploadFirmwareFormButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UploadFirmware(props: any) {
  const [openUploadFirmwareDialogueModel, setOpenUploadFirmwareDialogueModel] =
    useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [file, setFile] = useState<any>([]);
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [notes, setNotes] = useState('');
  const [md5, setMd5] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isFirmwareUploadLoading, setIsFirmwareUploadLoading] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const handleUploadFirmwareDialogueModelClose = () => {
    setFile([]);
    setFirmwareVersion('');
    setNotes('');
    setMd5('');
    setOpenUploadFirmwareDialogueModel(false);
  };

  const { deviceModelId, reloadFirmwareList } = props;
  const { oem_id } = getOemAndUserId();
  const isEngineeringFlow = isEngineering();

  const handleFirmwareUploadButtonClick = () => {
    setOpenUploadFirmwareDialogueModel(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the snackbar
  };

  const handleFimwareUploadButtonClick = async () => {
    setIsFirmwareUploadLoading(true);
    const type = 'firmware';
    let baseUrl = '';
    try {
      const { url } = await getPreSignedUrlForFirmware(
        oem_id,
        deviceModelId,
        type
      );
      await uploadTheAssetsToAmazon(url, file);
      baseUrl = getBaseUrl(url);
      // createEngineeringDeviceFirmwares( oem_id,deviceModelId, payload)
    } catch (error) {
      console.log('Error while uploading', error);
      setSeverity('error');
      setSnackbarMessage('Failed to upload firmware. Please try again.');
      setSnackbarOpen(true);
      setFirmwareVersion('');
      setNotes('');
      setMd5('');
      setIsFirmwareUploadLoading(false);
    } finally {
      setFile([]);
      handleUploadFirmwareDialogueModelClose();
    }
    // API call for create firmware
    if (baseUrl !== '') {
      try {
        const payload: IUploadFirmwareRequest = {
          firmware_version: firmwareVersion,
          note: notes,
          file_location: baseUrl,
          status: '',
          md5,
          tag: ''
        };
        if (isEngineeringFlow) {
          await createEngineeringDeviceFirmwares(
            oem_id,
            deviceModelId,
            payload
          );
        } else {
          await createProductionDeviceFirmwares(oem_id, deviceModelId, payload);
        }
        // success
        setSeverity('success');
        setSnackbarMessage('Firmware uploaded successfully.');
        setSnackbarOpen(true);
      } catch (error) {
        console.error(error);
        setSeverity('error');
        setSnackbarMessage('Failed to upload firmware. Please try again.');
        setSnackbarOpen(true);
      }
    }

    // reset all the fields
    setFirmwareVersion('');
    setNotes('');
    setMd5('');
    setIsFirmwareUploadLoading(false);
    handleUploadFirmwareDialogueModelClose();
    reloadFirmwareList();
  };

  return (
    <div>
      <UploadFirmwareFormButton
        label="Upload Firmware"
        handleClick={handleFirmwareUploadButtonClick}
        sx={{ fontSize: '16px', color: 'text.title', fontWeight: '500' }}
        // disabled={
        //   !isEngineeringFlow &&
        //   (deviceModelInformation.status === DEVICE_MODEL_STATUS.REVIEW ||
        //     deviceModelInformation.status === DEVICE_MODEL_STATUS.DRAFT)
        // }
      >
        Upload Firmware
      </UploadFirmwareFormButton>
      <UploadFirmwareDialogue
        openUploadFirmwareDialogueModel={openUploadFirmwareDialogueModel}
        handleUploadFirmwareDialogueModelClose={
          handleUploadFirmwareDialogueModelClose
        }
        setFirmwareVersion={setFirmwareVersion}
        md5={md5}
        notes={notes}
        setNotes={setNotes}
        firmwareVersion={firmwareVersion}
        setMd5={setMd5}
        isFirmwareUploadLoading={isFirmwareUploadLoading}
        handleFimwareUploadButtonClick={handleFimwareUploadButtonClick}
        file={file}
        setFile={setFile}
      />
      {snackbarOpen && (
        <InstaSnackBar
          message={snackbarMessage}
          severity={severity}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
        />
      )}
    </div>
  );
}

export default UploadFirmware;
