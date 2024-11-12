import { useState } from 'react';
import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography, Button as ButtonMui } from '@mui/material';
import styled from 'styled-components';
import CrossIcon from 'assets/new-assets/cross.svg';
import MuiCard from '@mui/material/Card';
import { getBaseUrl, getOemAndUserId, isEngineering } from 'utils';
import {
  getPreSignedUrl,
  updateEngineeringDeviceModel,
  updateProductionDeviceModel,
  uploadTheAssetsToAmazon
} from 'data/api/zeus';
import DeviceImagePlaceholder from 'assets/new-assets/noDevicePlaceholderImage.png';

const ImageUploadButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

// const ImageUploadFormButton = styled(Button)`
//   width: 100%;
//   height: 48px;
//   font-size: 16px;
//   font-weight: 500;
// `;

const FormField = styled('div')`
  width: 400px;
`;

const FormInput = styled('input')`
  padding: 12px;
`;

const Header = styled('header')`
  text-align: center;
  position: relative;
`;

const CrossImage = styled('img')`
  position: absolute;
  right: 0;
  top: 0;
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
  cursor: pointer;
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

const ImageContainer = styled('div')`
  position: relative;
  background: #fff;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const EditImageText = styled('div')`
  cursor: pointer;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 4px 1px 21px 0px rgba(111, 114, 115, 0.15);
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageUpload(props: any) {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [file, setFile] = useState<any>(null);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { dId, photoUrl } = props;
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const { oem_id } = getOemAndUserId();
  const isEngineeringFlow = isEngineering();

  const updateDeviceModelAPI = isEngineeringFlow
    ? updateEngineeringDeviceModel
    : updateProductionDeviceModel;

  const handleButtonClick = () => {
    console.log('Button clicked');
    handleOpen();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = (event: any) => {
    const userSelectedFile = event?.target?.files[0];
    setFile(userSelectedFile);
  };

  const handleUploadButtonClick = async () => {
    setIsImageUploadLoading(true);
    try {
      const { name } = file;
      const extensionFile = name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}.${extensionFile}`;
      const type = 'image';
      const { url } = await getPreSignedUrl(oem_id, dId, type, fileName);
      await uploadTheAssetsToAmazon(url, file);
      const baseUrl = getBaseUrl(url);
      setUploadedImageUrl(baseUrl);
      const payload = {
        photo_urls: [baseUrl]
      };
      await updateDeviceModelAPI(oem_id, dId, payload);
      setOpen(false);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsImageUploadLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <ImageContainer>
        <img
          src={uploadedImageUrl || photoUrl || DeviceImagePlaceholder}
          width="200px"
          height="200px"
          alt="Device"
          style={{ borderRadius: '20px' }}
        />
        <EditImageText>
          <Typography
            variant="h4"
            color="primary.main"
            sx={{
              textAlign: 'center',
              margin: '20px 0px',
              fontWeight: '400',
              '&:hover': {
                fontWeight: '500'
              }
            }}
            onClick={handleButtonClick}
          >
            Edit
          </Typography>
        </EditImageText>
      </ImageContainer>
      {/* <ImageUploadFormButton
        label="Upload Image"
        handleClick={handleButtonClick}
        sx={{ fontSize: '16px', color: 'text.title', fontWeight: '500' }}
      >
        Upload Image
      </ImageUploadFormButton> */}
      <CoreModal open={open} onClose={handleClose}>
        <>
          <Header>
            <Typography
              variant="h3"
              sx={{
                fontWeight: '500',
                marginBottom: '40px',
                textAlign: 'center'
              }}
            >
              Upload Image
            </Typography>
            <CrossImage src={CrossIcon} alt="cross" onClick={handleClose} />
          </Header>
          <form>
            <MuiCard variant="instavision" sx={{ marginBottom: '28px' }}>
              <FormField>
                <FormInput
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </FormField>
            </MuiCard>
            <ImageUploadButton
              label="Upload Image"
              sx={{ fontSize: '16px' }}
              onClick={handleUploadButtonClick}
              isDisabled={isImageUploadLoading}
              isLoading={isImageUploadLoading}
            >
              Upload Image
            </ImageUploadButton>
            <CancelButton
              disableRipple
              onClick={handleClose}
              sx={{ color: 'secondary.main', fontSize: '16px' }}
              style={{ background: 'transparent', marginTop: '10px' }}
            >
              {' '}
              Cancel{' '}
            </CancelButton>
          </form>
        </>
      </CoreModal>
    </div>
  );
}

export default ImageUpload;
