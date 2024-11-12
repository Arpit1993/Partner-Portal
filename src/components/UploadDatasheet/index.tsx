import { Button as ButtonMui, Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import CrossIcon from 'assets/new-assets/cross.svg';
import { ReactComponent as DropImageIcon } from 'assets/new-assets/documentDownload.svg';
import FileIcon from 'assets/new-assets/File.svg';
import UploadDataSheetIcon from 'assets/new-assets/uploadDatasheetIcon.svg';
import { DATASHEET_FILE_MAXIMUM_SIZE } from 'constants/constants';
import Button from 'core-components/Button';
import CoreModal from 'core-components/Modal/Modal';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

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

const UploadDatasheetFormButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
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
  border-radius: 50%;
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

const FileIconContainer = styled('img')`
  width: 54px;
  margin-left: 12px;
`;

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
function UploadDatasheet(props: any) {
  const { onDatasheetUpload } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [datasheetFile, setDatasheetFile] = useState<any>();
  const [isUploadingDatasheetLoading, setIsUploadDatasheetLoading] =
    useState(false);
  const [previewDatasheetName, setPreviewDatasheetName] = useState('');
  // const [previewDatasheetFile, setPreviewDatasheetFile] = useState(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleOpenUploadDatasheetModal = () => setOpen(true);

  const handleCloseUploadDatasheetModal = () => {
    setOpen(false);
    setDatasheetFile(null);
    setError('');
  };

  const handleDatasheetModalButtonClick = () => {
    // console.log('Button clicked');
    handleOpenUploadDatasheetModal();
  };

  const handleUploadDatasheet = () => {
    setIsUploadDatasheetLoading(true);
    try {
      const { name } = datasheetFile;

      // setPreviewDatasheetFile(datasheetFile);
      onDatasheetUpload(datasheetFile);
      setOpen(false);
      setPreviewDatasheetName(name);
    } catch (err) {
      console.log('error in uploading files locally', err);
    } finally {
      setIsUploadDatasheetLoading(false);
      setOpen(false);
      setDatasheetFile(null);
      setError('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files as FileList;
    if (!droppedFiles || droppedFiles.length === 0) return;
    const newFiles = Array.from(droppedFiles);
    if (newFiles?.[0]?.size > DATASHEET_FILE_MAXIMUM_SIZE) {
      setError('Datasheet file size should be less than 10MB');
      return;
    }
    setDatasheetFile(newFiles[0]);
    setError('');
  };

  // function if multiple files
  // const handleReplaceFile = (idx: number) => {
  //   const updatedFiles = Array.from(file);
  //   updatedFiles.splice(idx, 1);
  //   setFile(updatedFiles);
  // };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || selectedFile?.size > DATASHEET_FILE_MAXIMUM_SIZE) {
      setError('Datasheet file size should be less than 10MB');
      return;
    }
    setDatasheetFile(selectedFile);
    setError('');
    const { name } = selectedFile;
    setPreviewDatasheetName(name);
  };

  const handleReplaceFile = () => {
    setDatasheetFile(null);
  };

  useEffect(() => setDatasheetFile([]), []);

  const renderForm = () => {
    return (
      <CoreModal open={open} onClose={handleCloseUploadDatasheetModal}>
        <>
          <Header>
            <CrossImage
              src={CrossIcon}
              alt="cross"
              onClick={handleCloseUploadDatasheetModal}
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
              Upload Datasheet
            </Typography>
          </Header>
          <form>
            <MuiCard variant="instavision" sx={{ marginBottom: '28px' }}>
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
                  <FileIconContainer
                    src={FileIcon}
                    alt="File"
                    draggable="false"
                  />
                </TextContainer>
              </DragDropZone>
              {error && (
                <Typography
                  color="error.main"
                  variant="h5"
                  fontWeight={400}
                  sx={{
                    marginTop: '4px',
                    marginLeft: '8px'
                  }}
                >
                  {error}
                </Typography>
              )}
            </MuiCard>
            {datasheetFile && previewDatasheetName && (
              <div style={{ minWidth: '300px' }}>
                {/* {Array.from(file).map((fileItem: any, idx: number) => (
                <div key={idx} style={{display:'flex', justifyContent:'space-between'}}>
                <span><img src={UploadDataSheetIcon} alt='file-icon' style={{marginRight:'8px'}}/> 
                {fileItem.name}</span> 
                <NoBorderBlueButton onClick={()=>handleReplaceFile(idx)} disableRipple>Replace</NoBorderBlueButton>
                </div>
              ))} */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>
                    <img
                      src={UploadDataSheetIcon}
                      alt="file-icon"
                      style={{ marginRight: '8px' }}
                    />
                    {previewDatasheetName}
                  </span>
                  <NoBorderBlueButton onClick={() => handleReplaceFile()}>
                    Replace
                  </NoBorderBlueButton>
                </div>
              </div>
            )}

            <UploadDatasheetButton
              label="Upload Datasheet"
              sx={{ fontSize: '16px' }}
              onClick={handleUploadDatasheet}
              disableRipple
              isLoading={isUploadingDatasheetLoading}
              isDisabled={
                !datasheetFile ||
                datasheetFile?.length === 0 ||
                isUploadingDatasheetLoading
              }
            >
              Save
            </UploadDatasheetButton>

            <CancelButton
              disableRipple
              onClick={handleCloseUploadDatasheetModal}
              sx={{ color: 'secondary.main', fontSize: '16px' }}
              style={{ background: 'transparent', marginTop: '10px' }}
            >
              Cancel
            </CancelButton>
          </form>
        </>
      </CoreModal>
    );
  };

  return (
    <div>
      <UploadDatasheetFormButton
        label="Upload Datasheet"
        handleClick={handleDatasheetModalButtonClick}
        sx={{ fontSize: '16px', color: 'text.title', fontWeight: '500' }}
      >
        Upload Datasheet
      </UploadDatasheetFormButton>
      {/* <Typography variant="body1">{previewDatasheetName}</Typography> */}
      {renderForm()}
      {/* {datasheetFile && (
        <div style={{ marginTop: '10px' }}>
          <Typography variant="body1">{datasheetFile.name}</Typography>
        </div>
      )} */}
    </div>
  );
}

export default UploadDatasheet;
