import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { FIRMWARE_STATUS } from 'enums';

const OkayButton = styled(Button)`
  width: 100%;
  height: 56px;
`;

const Header = styled('header')`
  text-align: center;
  position: relative;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CheckForReviewFirmware(props: any) {
  const {
    openFimrwareReviewCheckModal,
    handleCloseFimrwareReviewCheckModal,
    reviewFirmwareStatus,
    reviewFirmwareVersion
  } = props;

  return (
    <CoreModal
      open={openFimrwareReviewCheckModal}
      onClose={handleCloseFimrwareReviewCheckModal}
    >
      <div style={{ maxWidth: '320px' }}>
        <Header>
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              marginTop: '36px'
            }}
          >
            Cannot Submit New Firmware for Review
          </Typography>
        </Header>
        <Typography
          variant="body1"
          sx={{
            fontWeight: '400',
            margin: '24px',
            textAlign: 'center'
          }}
        >
          {reviewFirmwareStatus === FIRMWARE_STATUS.REVIEW && (
            <Typography
              variant="h4"
              sx={{ fontWeight: '400', textAlign: 'justify' }}
            >
              You already have firmware version{' '}
              <span style={{ color: '#4389E1' }}>{reviewFirmwareVersion} </span>{' '}
              in <span style={{ color: '#4389E1' }}>review</span>. Please wait
              for it to be released or withdraw this version before submitting
              another firmware for review.
            </Typography>
          )}
          {reviewFirmwareStatus === FIRMWARE_STATUS.ALPHA && (
            <Typography
              variant="h4"
              sx={{ fontWeight: '400', textAlign: 'justify' }}
            >
              You already have firmware version{' '}
              <span style={{ color: '#4389E1' }}>{reviewFirmwareVersion} </span>{' '}
              under <span style={{ color: '#4389E1' }}>QA testing</span>. Please
              wait for it to be released or withdraw this version before
              submitting another firmware for review.
            </Typography>
          )}
        </Typography>
        <OkayButton
          label="Okay"
          handleClick={handleCloseFimrwareReviewCheckModal}
          sx={{ fontSize: '16px', color: 'primary.main' }}
          disableRipple
        >
          Okay
        </OkayButton>
      </div>
    </CoreModal>
  );
}

export default CheckForReviewFirmware;
