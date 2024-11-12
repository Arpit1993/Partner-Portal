import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useState } from 'react';
import FirmwareSDK from 'components/FirmwareSDK/FirmwareSDK';
import Select from 'core-components/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

const MainContainer = styled('main')`
  display: flex;
  gap: 24px;
`;

function FirmwareSDKDocumentation() {
  const [value, setValue] = useState('Security');

  // Correct function declaration for setting the value
  const setValueFunc = (event: SelectChangeEvent<unknown>) => {
    setValue(event.target.value as string);
  };

  return (
    <MainContainer>
      <main
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <Select sx={{ width: '208px' }} value={value} onChange={setValueFunc}>
            {' '}
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="Outdoor">Outdoor</MenuItem>
            <MenuItem value="Baby">Baby</MenuItem>
          </Select>
        </div>
        <Typography variant="h3" sx={{ fontWeight: '500' }}>
          FUHAN
        </Typography>
        <FirmwareSDK />
        <Typography variant="h3" sx={{ fontWeight: '500' }}>
          ANKEY
        </Typography>
        <FirmwareSDK />
      </main>
    </MainContainer>
  );
}

export default FirmwareSDKDocumentation;
