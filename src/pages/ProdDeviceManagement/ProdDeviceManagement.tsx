import { Typography, MenuItem, SelectChangeEvent } from '@mui/material';
import styled from '@emotion/styled';
import { useState } from 'react';
import ProdDeviceFiles from 'components/ProdDeviceFile/ProdDeviceFile';
import AddNewModel from 'components/AddModel/AddModelNew';
import Select from 'core-components/Select';

const MainContainer = styled('main')`
  display: flex;
  flex-direction:column
  gap: 24px;
  flex-grow:1;
`;

const Header = styled('main')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0px;
`;

const DeviceList = styled('main')`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonContainer = styled('div')`
  display: flex;
  gap: 20px;
`;

const ModelType = styled(Select)`
  height: 56px;
`;

function ProdDeviceManagement() {
  const [value, setValue] = useState('Security');

  const setValueFunc = (event: SelectChangeEvent<unknown>) => {
    setValue(event.target.value as string);
  };
  return (
    <MainContainer>
      <section
        style={{
          flexGrow: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header>
          <Typography variant="h2" sx={{ fontWeight: '500' }}>
            Device Management
          </Typography>
          <ButtonContainer>
            <AddNewModel />
            <ModelType
              sx={{ width: '160px' }}
              style={{ fontSize: '16px', fontWeight: '500' }}
              value={value}
              onChange={setValueFunc}
            >
              {' '}
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Outdoor">Outdoor</MenuItem>
              <MenuItem value="Baby">Baby</MenuItem>
            </ModelType>
          </ButtonContainer>
        </Header>
        <DeviceList>
          <ProdDeviceFiles />
          <ProdDeviceFiles />
          <ProdDeviceFiles />
        </DeviceList>
      </section>
    </MainContainer>
  );
}

export default ProdDeviceManagement;
