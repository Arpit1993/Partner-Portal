import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography, Button as ButtonMui } from '@mui/material';
import styled from 'styled-components';

const AddDIDConfirmButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

const Header = styled('header')`
  text-align: center;
  position: relative;
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
function AddDIDConfirm(props: any) {
  const { openModal, onCloseClick, onYesButtonClick, addDIDConfirmLoading } =
    props;

  return (
    <div>
      <CoreModal open={openModal} onClose={onCloseClick}>
        <>
          <Header>
            <Typography
              variant="h3"
              sx={{
                fontWeight: '500',
                margin: '24px 0px',
                textAlign: 'center',
                lineHeight: '1.5'
              }}
            >
              Are you sure you want to get a <br />
              new Device ID?
            </Typography>
          </Header>
          <AddDIDConfirmButton
            label="yes"
            handleClick={onYesButtonClick}
            sx={{ fontSize: '16px' }}
            isLoading={addDIDConfirmLoading}
            isDisabled={addDIDConfirmLoading}
          >
            Yes
          </AddDIDConfirmButton>
          <CancelButton
            disableRipple
            onClick={onCloseClick}
            sx={{ color: 'secondary.main', fontSize: '16px' }}
            style={{ background: 'transparent', marginTop: '10px' }}
          >
            {' '}
            Cancel{' '}
          </CancelButton>
        </>
      </CoreModal>
    </div>
  );
}

export default AddDIDConfirm;
