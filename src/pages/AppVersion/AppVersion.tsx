import styled from '@emotion/styled';
import IOSVersion from 'components/AppVersion/AndroidVersion';
import AndroidVersion from 'components/AppVersion/IOSVersion';

const MainContainer = styled('main')`
  display: flex;
  padding: 0px 24px;
`;

const AppVersionDetailsContainer = styled('section')`
  flex-grow: 1;
`;

function AppVersion() {
  return (
    <MainContainer>
      <AppVersionDetailsContainer>
        <AndroidVersion />

        <IOSVersion />
      </AppVersionDetailsContainer>
    </MainContainer>
  );
}

export default AppVersion;
