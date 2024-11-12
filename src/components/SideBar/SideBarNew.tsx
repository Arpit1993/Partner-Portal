import { Box, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import logo from 'assets/new-assets/logo.svg';
import { IsMobile } from 'hooks/isMobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LanguageSelector from 'components/LanguageSelector';
import { NavList } from './NavList';

const drawerWidth = IsMobile() ? window.screen.availWidth : 375;

const SideBarNav = styled.div`
  width: 100%;
`;

const LogoImage = styled.img`
  width: 60px;
  margin-bottom: 12px;
`;

type IProps = {
  setOpenSideBar: (state: boolean) => void;
  openSideBar: boolean;
};

function SideBar(props: IProps) {
  const { setOpenSideBar, openSideBar } = props;
  const isMobile = IsMobile();
  const navigate = useNavigate();

  const logoClick = () => {
    navigate('/engineering/device-management');
    setOpenSideBar(false);
  };

  return (
    <Drawer
      sx={{
        position: 'relative',
        padding: '24px',
        backgroundColor: '#F1F1F1',
        width: drawerWidth,
        flexShrink: 0,
        top: '60px',
        '& .MuiDrawer-paper': {
          backgroundColor: '#F1F1F1',
          width: drawerWidth,
          padding: '24px',
          top: isMobile ? 60 : 0,
          color: '#333333'
        },
        display: 'flex',
        alignItems: 'space-between'
      }}
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
      open={openSideBar}
    >
      <SideBarNav>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '36px',
            justifyContent: 'center'
          }}
        >
          <LogoImage
            src={logo}
            alt="logo"
            onClick={logoClick}
            draggable={false}
          />
          <Typography variant="h1" sx={{ fontWeight: '500' }}>
            OEM Portal
          </Typography>
        </Box>
        <NavList />
      </SideBarNav>
      <Box width="80%" sx={{ position: 'absolute', bottom: '24px' }}>
        <LanguageSelector />
      </Box>
    </Drawer>
  );
}
export default SideBar;
