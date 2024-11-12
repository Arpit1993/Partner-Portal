import { useRef } from 'react';
import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography, Button as ButtonMui } from '@mui/material';
import styled from 'styled-components';
import CrossIcon from 'assets/new-assets/cross.svg';
// import FileIcon from 'assets/new-assets/File.svg';
import { ReactComponent as DropImageIcon } from 'assets/new-assets/documentDownload.svg';
import UploadDataSheetIcon from 'assets/new-assets/uploadDatasheetIcon.svg';
import MuiCard from '@mui/material/Card';
import Input from 'core-components/Input';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const DropImageGreyIcon = styled(DropImageIcon)`
  path {
    stroke: #999999;
  }
  margin: auto;
`;

const UploadFirmwareButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
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

const DragDropZone = styled('div')`
  border: 2px solid rgba(67, 137, 225, 1);
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const NoBorderBlueButton = styled(ButtonMui)`
  padding: 0;
  margin: 0;
  border: none;
  color: primary.main;
  font-weight: 500;
  background: transparent;
  &:hover {
    font-weight: 600;
    border: none;
  }

  &:focus {
    outline: none;
    border: none;
  }

  &:active {
    outline: none;
    transform: scale(0.95);
    border: none;
  }
`;

// const FileIconContainer = styled('img')`
//   width: 54px;
//   margin-left: 12px;
// `;

const DropImageContainer = styled('div')(() => ({
  width: '48px',
  minWidth: '48px',
  minHeight: '48px',
  borderRadius: '50%',
  cursor: 'pointer',
  background:
    'linear-gradient(113deg,rgba(228, 228, 228, 1), rgba(241, 241, 241, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
  border: '1px solid transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto'
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UploadFirmwareDialogue(props: any) {
  const {
    openUploadFirmwareDialogueModel,
    handleUploadFirmwareDialogueModelClose,
    setFirmwareVersion,
    md5,
    setNotes,
    notes,
    firmwareVersion,
    setMd5,
    isFirmwareUploadLoading,
    handleFimwareUploadButtonClick,
    file,
    setFile
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFile(newFiles[0]);
    }
  };
  const handleReplaceFile = () => {
    setFile([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <CoreModal
      open={openUploadFirmwareDialogueModel}
      onClose={handleUploadFirmwareDialogueModelClose}
    >
      <>
        <Header>
          <CrossImage
            src={CrossIcon}
            alt="cross"
            onClick={() => {
              if (!isFirmwareUploadLoading) {
                handleUploadFirmwareDialogueModelClose();
              }
            }}
            draggable="false"
          />

          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              marginBottom: '40px',
              textAlign: 'center',
              marginTop: '20px'
            }}
          >
            Upload Firmware
          </Typography>
        </Header>
        <form style={{ minWidth: '380px' }}>
          <MuiCard variant="instavision" sx={{ marginBottom: '28px' }}>
            {file.length === 0 && (
              <DragDropZone onDragOver={handleDragOver} onDrop={handleDrop}>
                <DropImageContainer>
                  <DropImageGreyIcon />
                </DropImageContainer>
                <FormInput
                  type="file"
                  onChange={handleFileUpload}
                  ref={inputRef}
                  hidden
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: '400', color: 'text.body' }}
                >
                  <NoBorderBlueButton
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.click();
                      }
                    }}
                    disableRipple
                    sx={{
                      fontSize: '16px',
                      '&:hover': {
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Click to Select
                  </NoBorderBlueButton>
                  or drag and drop{' '}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: '400', color: 'text.body' }}
                >
                  Binary file (max. 10MB){' '}
                </Typography>
              </DragDropZone>
            )}
          </MuiCard>
          {file.length !== 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <img
                    src={UploadDataSheetIcon}
                    alt="file-icon"
                    style={{ marginRight: '8px' }}
                  />
                  {file.name}
                </span>
                <NoBorderBlueButton
                  disableRipple
                  onClick={() => handleReplaceFile()}
                  disabled={isFirmwareUploadLoading}
                >
                  Replace
                </NoBorderBlueButton>
              </div>
              <MuiCard
                variant="instavisionCardWithBorder"
                sx={{ margin: '16px 0' }}
              >
                <Input
                  id="firmware_version"
                  name="firmware_version"
                  placeholder="Firmware Version *"
                  required
                  fullWidth
                  type="text"
                  value={firmwareVersion}
                  onChange={(event) => setFirmwareVersion(event.target.value)}
                  style={{ padding: '10px 20px' }}
                />
              </MuiCard>
              <MuiCard
                variant="instavisionCardWithBorder"
                sx={{ margin: '16px 0' }}
              >
                <Input
                  id="md5"
                  name="md5"
                  placeholder="Input MD5 *"
                  required
                  fullWidth
                  type="text"
                  value={md5}
                  onChange={(event) => setMd5(event.target.value)}
                  style={{ padding: '10px 20px' }}
                />
              </MuiCard>
              <MuiCard
                variant="instavisionCardWithBorder"
                sx={{ margin: '16px 0' }}
              >
                <TextareaAutosize
                  id="tag"
                  name="tag"
                  placeholder="Notes"
                  style={{
                    padding: '10px 20px',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  minLength={300}
                  minRows={3}
                />
              </MuiCard>
            </div>
          )}

          <UploadFirmwareButton
            label="Upload Firmware"
            sx={{ fontSize: '16px' }}
            onClick={handleFimwareUploadButtonClick}
            isLoading={isFirmwareUploadLoading}
            disabled={isFirmwareUploadLoading || !(md5 && firmwareVersion)}
            disableRipple
          >
            Upload Firmware
          </UploadFirmwareButton>

          <CancelButton
            disableRipple
            disabled={isFirmwareUploadLoading}
            onClick={handleUploadFirmwareDialogueModelClose}
            sx={{ color: 'secondary.main', fontSize: '16px' }}
            style={{ background: 'transparent', marginTop: '10px' }}
          >
            {' '}
            Cancel{' '}
          </CancelButton>
        </form>
      </>
    </CoreModal>
  );
}

export default UploadFirmwareDialogue;
