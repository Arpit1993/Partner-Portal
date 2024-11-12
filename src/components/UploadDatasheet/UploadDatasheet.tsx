import Button from 'core-components/Button';
import {
  getPreSignedUrl,
  updateEngineeringDeviceModel,
  updateProductionDeviceModel,
  uploadTheAssetsToAmazon
} from 'data/api/zeus';
import { useState } from 'react';
import styled from 'styled-components';
import { getBaseUrl, getOemAndUserId, isEngineering } from 'utils';
import UploadDatasheetDialogue from './UploadDatasheetDialogue';
// import Input from 'core-components/Input';

const UploadDatasheetFormButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UploadDatasheet(props: any) {
  const [
    openUploadDatasheetDialogueModal,
    setOpenUploadDatasheetDialogueModel
  ] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [file, setFile] = useState<any>([]);
  const [isUploadingDatasheetLoading, setIsUploadDatasheetLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleDatasheetUploadClick = () =>
    setOpenUploadDatasheetDialogueModel(true);

  const handleUploadDatatasheetDialogueModalClose = () => {
    setErrorMessage('');
    setOpenUploadDatasheetDialogueModel(false);
  };

  const {
    dId,
    setIsDatasheetUploaded,
    setSeverity,
    setSnackbarMessage,
    setSnackbarOpen
  } = props;
  const { oem_id } = getOemAndUserId();
  const isEngineeringFlow = isEngineering();

  const updateDeviceModelAPI = isEngineeringFlow
    ? updateEngineeringDeviceModel
    : updateProductionDeviceModel;

  const handleDatsheetUploadButtonClick = async () => {
    // console.log('file', file);
    // const { name, type } = file;
    // console.log('name', name);
    // console.log('type', type);
    const { name } = file;
    let baseUrl = '';
    const type = 'datasheet';
    setIsUploadDatasheetLoading(true);
    try {
      const { url } = await getPreSignedUrl(oem_id, dId, type, name);
      await uploadTheAssetsToAmazon(url, file);
      baseUrl = getBaseUrl(url);
      setOpenUploadDatasheetDialogueModel(false);
    } catch (error) {
      console.log('Error while uploading', error);
      setSeverity('error');
      setSnackbarMessage('Failed to upload Datasheet. Please try again');
    } finally {
      setFile([]);
      setIsUploadDatasheetLoading(false);
    }

    if (baseUrl !== '') {
      try {
        const payload = {
          datasheet: baseUrl
        };
        await updateDeviceModelAPI(oem_id, dId, payload);
        setSeverity('success');
        setSnackbarMessage('Datasheet uploaded successfully.');
        setSnackbarOpen(true);
        setIsDatasheetUploaded(true);
      } catch (error) {
        console.error(error);
        setSeverity('error');
        setSnackbarMessage('Failed to upload firmware. Please try again');
        setSnackbarOpen(true);
      }
    }
    setIsUploadDatasheetLoading(false);
    handleUploadDatatasheetDialogueModalClose();
  };

  // const payload = {
  //   datasheet: baseUrl
  // };
  // await updateDeviceModelAPI(oem_id, dId, payload);
  // await fetchDeviceList();

  return (
    <div>
      <UploadDatasheetFormButton
        label="Upload Datasheet"
        handleClick={handleDatasheetUploadClick}
        sx={{ fontSize: '16px', color: 'text.title', fontWeight: '500' }}
      >
        Upload Datasheet
      </UploadDatasheetFormButton>
      <UploadDatasheetDialogue
        openUploadDatasheetDialogueModal={openUploadDatasheetDialogueModal}
        handleUploadDatatasheetDialogueModalClose={
          handleUploadDatatasheetDialogueModalClose
        }
        isUploadingDatasheetLoading={isUploadingDatasheetLoading}
        handleDatsheetUploadButtonClick={handleDatsheetUploadButtonClick}
        file={file}
        setFile={setFile}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
}

export default UploadDatasheet;
