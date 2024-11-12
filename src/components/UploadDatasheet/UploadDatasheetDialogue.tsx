import { Button as ButtonMui, Typography } from '@mui/material';
import Button from 'core-components/Button';
import CoreModal from 'core-components/Modal/Modal';
import { useRef } from 'react';
import styled from 'styled-components';
// import CrossIcon from 'assets/new-assets/cross.svg';
// import FileIcon from 'assets/new-assets/File.svg';
import MuiCard from '@mui/material/Card';
import { ReactComponent as DropImageIcon } from 'assets/new-assets/documentDownload.svg';
import UploadDataSheetIcon from 'assets/new-assets/uploadDatasheetIcon.svg';
import { DATASHEET_FILE_MAXIMUM_SIZE } from 'constants/constants';
// import { getBaseUrl, getOemAndUserId, isEngineering } from 'utils';
// import {
//   getPreSignedUrl,
//   updateEngineeringDeviceModel,
//   updateProductionDeviceModel,
//   uploadTheAssetsToAmazon
// } from 'data/api/zeus';
// import Input from 'core-components/Input';

const DropImageGreyIcon = styled(DropImageIcon)`
  path {
    stroke: #999999;
  }
  margin: auto;
`;

const UploadDatasheetButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

// const UploadDatasheetFormButton = styled(Button)`
//   width: 100%;
//   height: 48px;
//   font-size: 16px;
//   font-weight: 500;
// `;

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

const TextContainer = styled('div')`
  display: flex;
  margin: 0;
  padding: 0;
  margin-top: 18px;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UploadDatasheetDialogue(props: any) {
  const {
    openUploadDatasheetDialogueModal,
    handleUploadDatatasheetDialogueModalClose,
    isUploadingDatasheetLoading,
    handleDatsheetUploadButtonClick,
    file,
    setFile,
    errorMessage,
    setErrorMessage
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // const handleButtonClick = () => {
  //   console.log('Button clicked');
  //   handleOpen();
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files as FileList;
    if (droppedFiles.length === 0) return;
    if (droppedFiles?.[0]?.size > DATASHEET_FILE_MAXIMUM_SIZE) {
      setErrorMessage('Datasheet file size should be less than 10MB');
      return;
    }
    const newFiles = Array.from(droppedFiles);
    setFile(newFiles[0]);
    setErrorMessage('');
  };

  // function if multiple files
  // const handleReplaceFile = (idx: number) => {
  //   const updatedFiles = Array.from(file);
  //   updatedFiles.splice(idx, 1);
  //   setFile(updatedFiles);
  // };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || selectedFile.size > DATASHEET_FILE_MAXIMUM_SIZE) {
      setErrorMessage('Datasheet file size should be less than 10MB');
      return;
    }
    setFile(selectedFile);
    setErrorMessage('');
  };

  const handleReplaceFile = () => {
    setFile([]);
  };

  return (
    <CoreModal
      open={openUploadDatasheetDialogueModal}
      onClose={handleUploadDatatasheetDialogueModalClose}
    >
      <>
        <Header>
          {/* <CrossImage
            src={CrossIcon}
            alt="cross"
            onClick={handleUploadDatatasheetDialogueModalClose}
            draggable="false"
          /> */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              marginBottom: '40px',
              textAlign: 'center',
              marginTop: '20px'
            }}
          >
            Upload Datasheet
          </Typography>
        </Header>
        <form>
          <MuiCard variant="instavision" sx={{ marginBottom: '28px' }}>
            {file.length === 0 && (
              <>
                <DragDropZone onDragOver={handleDragOver} onDrop={handleDrop}>
                  <DropImageContainer>
                    <DropImageGreyIcon />
                  </DropImageContainer>
                  <FormInput
                    type="file"
                    accept="application/pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    ref={inputRef}
                    hidden
                  />

                  <TextContainer style={{ display: 'flex' }}>
                    <div style={{ textAlign: 'center' }}>
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
                        PDF (max. 10MB){' '}
                      </Typography>
                    </div>
                    {/* <FileIconContainer
                      src={FileIcon}
                      alt="File"
                      draggable="false"
                    /> */}
                  </TextContainer>
                </DragDropZone>
                {errorMessage && (
                  <Typography
                    color="error.main"
                    variant="h5"
                    fontWeight={400}
                    sx={{
                      marginTop: '4px',
                      marginLeft: '8px'
                    }}
                  >
                    {errorMessage}
                  </Typography>
                )}
              </>
            )}
          </MuiCard>
          {file.length !== 0 && (
            <div style={{ minWidth: '300px' }}>
              {/* {Array.from(file).map((fileItem: any, idx: number) => (
                <div key={idx} style={{display:'flex', justifyContent:'space-between'}}>
                <span><img src={UploadDataSheetIcon} alt='file-icon' style={{marginRight:'8px'}}/> 
                {fileItem.name}</span> 
                <NoBorderBlueButton onClick={()=>handleReplaceFile(idx)} disableRipple>Replace</NoBorderBlueButton>
                </div>
              ))} */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <img
                    src={UploadDataSheetIcon}
                    alt="file-icon"
                    style={{ marginRight: '8px' }}
                  />
                  {file.name}
                </span>
                <NoBorderBlueButton onClick={() => handleReplaceFile()}>
                  Replace
                </NoBorderBlueButton>
              </div>
              {/* <MuiCard
                  variant="instavisionCardWithBorder"
                  sx={{ margin: '16px 0' }}
                >
                  <Input
                    id="datasheet_version"
                    name="datasheet_version"
                    placeholder="Datasheet Version"
                    required
                    fullWidth
                    type="text"
                    onChange={handleButtonClick} // needs to be changed
                    style={{ padding: '10px 20px' }}
                  />
                </MuiCard> */}
            </div>
          )}

          <UploadDatasheetButton
            label="Upload Datasheet"
            sx={{ fontSize: '16px' }}
            onClick={handleDatsheetUploadButtonClick}
            disableRipple
            isLoading={isUploadingDatasheetLoading}
            isDisabled={file.length === 0 || isUploadingDatasheetLoading}
          >
            Save
          </UploadDatasheetButton>

          <CancelButton
            disableRipple
            onClick={handleUploadDatatasheetDialogueModalClose}
            sx={{ color: 'secondary.main', fontSize: '16px' }}
            style={{ background: 'transparent', marginTop: '10px' }}
            disabled={isUploadingDatasheetLoading}
          >
            {' '}
            Cancel{' '}
          </CancelButton>
        </form>
      </>
    </CoreModal>
  );
}

export default UploadDatasheetDialogue;
