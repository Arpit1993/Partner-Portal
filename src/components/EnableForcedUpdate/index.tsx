import { Typography, Button as ButtonMui, Card, MenuItem } from '@mui/material';
import CoreModal from 'core-components/Modal/Modal';
import styled from 'styled-components';
import Button from 'core-components/Button';
import InstavisionCheckbox from 'core-components/Checkbox';
import Select from 'core-components/Select';
import { IDIDResponse } from 'types/response/zeus/firmwareTypes';

const Header = styled('header')`
  text-align: center;
  position: relative;
`;

const UpdateAllDevicesCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`;
const SaveButton = styled(Button)`
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
function EnableForcedUpdate(props: any) {
  const {
    selectedFirmware,
    openEnableForcedUpdateModal,
    handleEnableForcedUpdateModalClose,
    handleEnableForcedUpdateButtonClick,
    didList,
    handleEnableForcedFieldChange,
    isEnableForcedUpdateLoading
  } = props;
  return (
    <CoreModal
      open={openEnableForcedUpdateModal}
      onClose={handleEnableForcedUpdateModalClose}
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
            Enable Forced Updates For {selectedFirmware}?
          </Typography>
        </Header>

        <UpdateAllDevicesCard variant="instavisionCardWithBorder">
          Update all devices
          <InstavisionCheckbox
            onChange={handleEnableForcedFieldChange}
            value="all"
          />
        </UpdateAllDevicesCard>
        <p style={{ textAlign: 'center', padding: '16px 0px', margin: 0 }}>
          {' '}
          -or-{' '}
        </p>
        <Select
          label="Select Device"
          style={{ width: '100%', marginBottom: '16px' }}
          onChange={handleEnableForcedFieldChange}
          defaultValue="select"
        >
          <MenuItem value="select" disabled>
            Select Device
          </MenuItem>
          {didList.map((list: IDIDResponse) => {
            return (
              <MenuItem value={list?.id} key={list?.id}>
                {list?.id}
              </MenuItem>
            );
          })}
        </Select>
        <SaveButton
          label="Save"
          sx={{ fontSize: '16px' }}
          onClick={handleEnableForcedUpdateButtonClick}
          isLoading={isEnableForcedUpdateLoading}
          isDisabled={isEnableForcedUpdateLoading}
        >
          Save
        </SaveButton>
        <CancelButton
          disableRipple
          onClick={handleEnableForcedUpdateModalClose}
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

export default EnableForcedUpdate;
