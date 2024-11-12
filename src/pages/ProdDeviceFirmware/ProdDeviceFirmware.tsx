import styled from '@emotion/styled';
import ProdDeviceManageFirmware from 'components/ProdDeviceManageFirmware/ProdDeviceManageFirmware';
import ProdDeviceTitle from 'components/ProdDeviceTitle/ProdDeviceTitle';

const MainContainer = styled('main')`
  display: flex;
  padding: 24px;
`;

const DeviceDetailsContainer = styled('section')`
  flex-grow: 1;
  padding: 16px;
`;

function ProdDeviceManageFirmwareAndDID() {
  return (
    <MainContainer>
      <DeviceDetailsContainer>
        <ProdDeviceTitle />
        <ProdDeviceManageFirmware />
      </DeviceDetailsContainer>
    </MainContainer>
  );
}

export default ProdDeviceManageFirmwareAndDID;
