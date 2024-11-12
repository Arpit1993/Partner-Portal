import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip
import styled from '@emotion/styled';
import { ReactComponent as DocumentDownloadIcon } from 'assets/new-assets/documentDownload.svg';

interface DownloadButtonProps {
  fileUrl: string;
  fileAvailableTooltipText?: string; // Tooltip text when file is available
  fileUnavailableTooltipText?: string; // Tooltip text when file is not available
}

const DocumentDownloadGreyIcon = styled(DocumentDownloadIcon)`
  path {
    stroke: #888;
  }
`;

const CustomButton = styled(Button)(() => ({
  width: '56px',
  minWidth: '56px',
  minHeight: '56px',
  borderRadius: '50%',
  cursor: 'pointer',
  background:
    'linear-gradient(113deg,rgba(228, 228, 228, 1), rgba(241, 241, 241, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
  border: '1px solid transparent',
  transition: 'background 0.3s, transform 0.3s',

  '&:hover': {
    background:
      'linear-gradient(113deg,rgba(210, 210, 210, 1), rgba(220, 220, 220, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
    transform: 'scale(1)'
  },
  '&:focus': {
    outline: 'none'
  },
  '&:active': {
    transform: 'scale(0.95)'
  }
}));

function DownloadButton({
  fileUrl,
  fileAvailableTooltipText = 'Download File', // Default text when file is available
  fileUnavailableTooltipText = 'No File Available' // Default text when file is unavailable
}: DownloadButtonProps): JSX.Element {
  const handleDownload = () => {
    if (!fileUrl) {
      console.error('No file URL provided');
      return;
    }

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(new Blob([blob]));
        const fileName = fileUrl.split('/').pop();
        const link = document.createElement('a');
        link.href = blobURL;
        if (fileName) {
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      });
  };

  return (
    <Tooltip
      title={fileUrl ? fileAvailableTooltipText : fileUnavailableTooltipText}
    >
      <span>
        {' '}
        <CustomButton
          disableRipple
          onClick={handleDownload}
          disabled={!fileUrl}
        >
          <DocumentDownloadGreyIcon />
        </CustomButton>
      </span>
    </Tooltip>
  );
}

export default DownloadButton;
