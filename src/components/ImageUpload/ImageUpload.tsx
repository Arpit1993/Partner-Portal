import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography, Button as ButtonMui } from '@mui/material';
import styled from 'styled-components';
// import CrossIcon from 'assets/new-assets/cross.svg';
import MuiCard from '@mui/material/Card';
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

// const CrossImage = styled('img')`
//   position: absolute;
//   right: 0;
//   top: 0;
//   cursor: pointer;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: scale(1.1);
//   }

//   &:active {
//     transform: scale(0.9);
//   }
// `;

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
  const {
    photoUrl,
    openUploadImageModal,
    isImageUploadLoading,
    previewImageUrl,
    handleOpenImageUploadModal,
    handleCloseImageUploadModal,
    handleImageFileUpload,
    handleImageUploadButtonClick
  } = props;

  return (
    <div>
      <ImageContainer>
        <img
          src={previewImageUrl || photoUrl || DeviceImagePlaceholder}
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
            onClick={handleOpenImageUploadModal}
          >
            Edit
          </Typography>
        </EditImageText>
      </ImageContainer>
      <CoreModal
        open={openUploadImageModal}
        onClose={handleCloseImageUploadModal}
      >
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
            {/* <CrossImage
              src={CrossIcon}
              alt="cross"
              onClick={handleCloseImageUploadModal}
            /> */}
          </Header>
          <form>
            <MuiCard variant="instavision" sx={{ marginBottom: '28px' }}>
              <FormField>
                <FormInput
                  type="file"
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  required
                />
              </FormField>
            </MuiCard>
            <ImageUploadButton
              label="Upload Image"
              sx={{ fontSize: '16px' }}
              onClick={handleImageUploadButtonClick}
              isDisabled={isImageUploadLoading}
              isLoading={isImageUploadLoading}
            >
              Upload Image
            </ImageUploadButton>
            <CancelButton
              disableRipple
              onClick={handleCloseImageUploadModal}
              sx={{ color: 'secondary.main', fontSize: '16px' }}
              style={{ background: 'transparent', marginTop: '10px' }}
              disabled={isImageUploadLoading}
            >
              Cancel
            </CancelButton>
          </form>
        </>
      </CoreModal>
    </div>
  );
}

export default ImageUpload;
