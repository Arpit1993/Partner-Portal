import {
  Typography,
  Button as ButtonMui,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'; // Import SelectChangeEvent
import CoreModal from 'core-components/Modal/Modal';
import styled from 'styled-components';
import Button from 'core-components/Button';
import Select from 'core-components/Select';
import { IDIDResponse } from 'types/response/zeus/firmwareTypes';
import { DEVICE_STATUS } from 'enums';
import { useState } from 'react';

const Header = styled('header')`
  text-align: center;
  position: relative;
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
function UpdateSpecificDid(props: any) {
  const {
    selectedFirmware,
    openUpdateSpecificDidModal,
    handleUpdateSpecificDidModalClose,
    handleUpdateSpecificDidButtonClick,
    didList,
    handleUpdateSpecificDidFieldChange,
    isUpdateSpecificDidLoading
  } = props;

  const [selectedDid, setSelectedDid] = useState<string>('select');

  const handleDidChange = (event: SelectChangeEvent<unknown>) => {
    // Updated type
    const value = event.target.value as string;
    setSelectedDid(value);
    handleUpdateSpecificDidFieldChange(event); // Preserving the original callback
  };

  return (
    <CoreModal
      open={openUpdateSpecificDidModal}
      onClose={handleUpdateSpecificDidModalClose}
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
            Update Specific DIDs With {selectedFirmware}?
          </Typography>
        </Header>

        <Select
          label="Select DID"
          style={{ width: '100%', marginBottom: '16px' }}
          onChange={handleDidChange} // Fixed onChange handler
          defaultValue="select"
        >
          <MenuItem value="select" disabled>
            Select DID
          </MenuItem>
          {didList.map((list: IDIDResponse) => {
            return (
              <MenuItem
                value={list?.id}
                key={list?.id}
                disabled={list?.status !== DEVICE_STATUS.ONLINE}
              >
                {list?.id}
              </MenuItem>
            );
          })}
        </Select>

        <SaveButton
          label="Save"
          sx={{ fontSize: '16px' }}
          onClick={handleUpdateSpecificDidButtonClick}
          isLoading={isUpdateSpecificDidLoading}
          isDisabled={isUpdateSpecificDidLoading || selectedDid === 'select'}
        >
          Save
        </SaveButton>

        <CancelButton
          disableRipple
          onClick={handleUpdateSpecificDidModalClose}
          sx={{ color: 'secondary.main', fontSize: '16px' }}
          style={{ background: 'transparent', marginTop: '10px' }}
        >
          Cancel
        </CancelButton>
      </>
    </CoreModal>
  );
}

export default UpdateSpecificDid;
