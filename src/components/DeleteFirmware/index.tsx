import { Typography, Button as ButtonMui } from '@mui/material';
import CoreModal from 'core-components/Modal/Modal';
import styled from 'styled-components';
import Button from 'core-components/Button';

const Header = styled('header')`
  text-align: center;
  position: relative;
`;

const DeleteButton = styled(Button)`
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
function DeleteFirmware(props: any) {
  const {
    selectedFirmware,
    openDeleteFirmwareModal,
    handleDeleteFirmwareModalClose,
    handleDeleteFirmwareButtonClick,
    isDeletingFirmwareLoading
  } = props;
  return (
    <CoreModal
      open={openDeleteFirmwareModal}
      onClose={handleDeleteFirmwareModalClose}
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
            Are You Sure You Want To Delete {selectedFirmware}?
          </Typography>
        </Header>

        <DeleteButton
          label="Delete"
          sx={{ fontSize: '16px' }}
          onClick={handleDeleteFirmwareButtonClick}
          isLoading={isDeletingFirmwareLoading}
          isDisabled={isDeletingFirmwareLoading}
        >
          Delete
        </DeleteButton>
        <CancelButton
          disableRipple
          onClick={handleDeleteFirmwareModalClose}
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

export default DeleteFirmware;
