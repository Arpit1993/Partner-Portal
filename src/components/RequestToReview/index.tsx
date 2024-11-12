import { Typography, Button as ButtonMui } from '@mui/material';
import CoreModal from 'core-components/Modal/Modal';
import styled from 'styled-components';
import Button from 'core-components/Button';

const Header = styled('header')`
  text-align: center;
  position: relative;
`;

const RequestButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RequestToReviewFirmware(props: any) {
  const {
    selectedFirmware,
    openRequestToReviewModal,
    handleRequestToReviewClose,
    handleRequestToReviewButtonClick,
    isRequestToReviewLoading
  } = props;
  return (
    <CoreModal
      open={openRequestToReviewModal}
      onClose={handleRequestToReviewClose}
    >
      <>
        <Header>
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              margin: '24px 0px 16px 0px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}
          >
            Are you sure you want to send <br />
            <span style={{ color: '#4389E1' }}>
              Firmware Version {selectedFirmware}{' '}
            </span>
            for <br />
            review?
          </Typography>
        </Header>

        <RequestButton
          label="Request"
          sx={{ fontSize: '16px' }}
          onClick={handleRequestToReviewButtonClick}
          isLoading={isRequestToReviewLoading}
          isDisabled={isRequestToReviewLoading}
        >
          Make Request
        </RequestButton>
        <CancelButton
          disableRipple
          onClick={handleRequestToReviewClose}
          sx={{ color: 'secondary.main', fontSize: '16px' }}
          style={{ background: 'transparent', marginTop: '10px' }}
        >
          {' '}
          Cancel{' '}
        </CancelButton>
      </>
    </CoreModal>
  );
}

export default RequestToReviewFirmware;
