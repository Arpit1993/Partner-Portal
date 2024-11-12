import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography, Button as ButtonMui } from '@mui/material';
import styled from '@emotion/styled';
import CrossIcon from 'assets/new-assets/cross.svg';

const RequestProductionButton = styled(Button)`
  width: 100%;
  height: 56px;
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
  padding: 12px 0;
  border: none;
  width: 100%;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RequestProduction(props: any) {
  const {
    openModal,
    closeModal,
    deviceId,
    isRequestProductionLoading,
    onRequestProductionButtonClick
  } = props;

  return (
    <CoreModal
      open={openModal}
      onClose={closeModal}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' }
        }
      }}
    >
      <>
        <Header>
          <CrossImage src={CrossIcon} alt="cross" onClick={closeModal} />
        </Header>
        <Typography
          variant="body1"
          sx={{
            fontWeight: '500',
            margin: '60px 0 20px 0',
            textAlign: 'center',
            width: '280px'
          }}
        >
          Are you sure you want to request production?
        </Typography>
        <RequestProductionButton
          label="Request Production"
          handleClick={() => onRequestProductionButtonClick(deviceId)}
          sx={{ fontSize: '16px', color: 'text.title' }}
          isLoading={isRequestProductionLoading}
          isDisabled={isRequestProductionLoading}
        >
          Yes
        </RequestProductionButton>
        <CancelButton
          disableRipple
          onClick={closeModal}
          sx={{ color: 'secondary.main', fontSize: '16px' }}
          style={{ background: 'transparent', marginTop: '10px' }}
        >
          Cancel
        </CancelButton>
      </>
    </CoreModal>
  );
}

export default RequestProduction;
