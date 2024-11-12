/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from 'components/SideBar/SideBarNew';
import TopBar from 'components/TopBar/TopBar';
import { IsMobile } from 'hooks/isMobile';
import { useState } from 'react';
import { isAuthenticated } from 'utils';

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ContentContainer = styled.div`
  padding: 20px 20px;
  display: block;
  flex: 1;
`;

function PrivateRoute() {
  // const { isAuthenticated } = useSelector((state: any) => state.user);
  const isMobile = IsMobile();
  const [openSideBar, setOpenSideBar] = useState(!isMobile);
  console.log('openSideBar: ', openSideBar);
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // authorized so return child components
  return (
    <PageContainer>
      <SideBar setOpenSideBar={setOpenSideBar} openSideBar />

      <Container>
        <TopBar setOpenSideBar={setOpenSideBar} openSideBar />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </Container>
    </PageContainer>
  );
}

export default PrivateRoute;
