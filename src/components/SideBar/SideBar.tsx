import { ReactElement, useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useTranslation } from 'react-i18next';
// import { ReactComponent as AppVersionIcon } from 'assets/new-assets/appVersion.svg';
import { ReactComponent as DeviceManagementIcon } from 'assets/new-assets/deviceManagement.svg';
// import { ReactComponent as FirmwareSDKIcon } from 'assets/new-assets/firmwareSDK.svg';
import { ReactComponent as UserManagementIcon } from 'assets/new-assets/userManagement.svg';
import { ReactComponent as CircleIcon } from 'assets/new-assets/radioIcon.svg';
import { ReactComponent as Logo } from 'assets/new-assets/logo.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { IsMobile } from 'hooks/isMobile';
import styled from '@emotion/styled';
import LanguageSelector from 'components/LanguageSelector';
import MuiCard from '@mui/material/Card';
import NavCard from '../NavCard/NavCard';

const drawerWidth = IsMobile() ? window.screen.availWidth : 360;

const SideBarNav = styled('div')`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const Heading = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding: 0;
`;

type NavData = {
  name: string;
  icon: ReactElement;
  link: string;
  subItems?: NavData[];
};

export const leftNavData: NavData[] = [
  {
    name: 'Device Management',
    icon: <DeviceManagementIcon />,
    link: '/engineering/device-management',
    subItems: [
      {
        name: 'Engineering',
        icon: <CircleIcon />,
        link: '/engineering/device-management'
      },
      {
        name: 'Production',
        icon: <CircleIcon />,
        link: '/production/device-management'
      }
    ]
  },
  {
    name: 'User Management',
    icon: <UserManagementIcon />,
    link: '/user-management'
  }
  // {
  //   name: 'App Version',
  //   icon: <AppVersionIcon />,
  //   link: '/app-version'
  // },
  // {
  //   name: 'Firmware SDK & Documentation',
  //   icon: <FirmwareSDKIcon />,
  //   link: '/firmware-management'
  // }
];

type IProps = {
  setOpenSideBar: (state: boolean) => void;
  openSideBar: boolean;
};

function SideBar(props: IProps) {
  const { setOpenSideBar, openSideBar } = props;
  const isMobile = IsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const index = leftNavData.findIndex((el) => el.link === location.pathname);
  const [selectedNav, setSelectedNav] = useState<NavData | null>(
    leftNavData[index] || null
  );

  useEffect(() => {
    setSelectedNav(leftNavData[index]);
  }, [index]);

  const onSideNavClick = (nav: NavData) => {
    setSelectedNav(nav);
    navigate(nav?.link);
    if (isMobile) {
      setOpenSideBar(false);
    }
  };

  const logoClick = () => {
    navigate('/ActiveDevices');
    setOpenSideBar(false);
  };

  const renderNavItem = (nav: NavData) => {
    const isSelected =
      selectedNav?.name === nav.name ||
      nav.subItems?.some((sub) => sub.name === selectedNav?.name);

    return (
      <ListItem key={nav.name} disablePadding sx={{ m: '0' }}>
        <ListItemButton
          selected={isSelected}
          style={{
            alignItems: 'center',
            color: isSelected ? '#5FA4FB' : '#333',
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '24px'
          }}
          onClick={() => {
            if (nav.subItems && nav.subItems.length > 0) {
              setSelectedNav(nav.subItems[0]);
              navigate(nav.subItems[0].link);
            } else {
              onSideNavClick(nav);
            }
          }}
        >
          <ListItemIcon
            sx={{
              color: isSelected ? '#5FA4FB' : '#333',
              padding: '0',
              minWidth: '0',
              marginRight: '12px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg path': {
                stroke: isSelected ? '#5FA4FB' : '#BEBEBE',
                transition: 'fill 0.3s ease'
              }
            }}
          >
            {nav.icon}
          </ListItemIcon>
          <ListItemText primary={t(nav.name)} />
        </ListItemButton>
      </ListItem>
    );
  };

  const list = () => (
    <List
      sx={{
        m: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <Heading>
        <Logo onClick={logoClick} style={{ width: '60px' }} />
        <Typography
          variant="h1"
          color="text.title"
          sx={{ fontWeight: '500', paddingTop: '6px' }}
        >
          OEM Portal
        </Typography>
      </Heading>
      {leftNavData.map((nav) =>
        nav.name === 'Device Management' ? (
          <NavCard key={nav.name}>
            {renderNavItem(nav)}
            {nav.subItems &&
              nav.subItems.map((subItem) => renderNavItem(subItem))}
          </NavCard>
        ) : (
          <MuiCard key={nav.name} variant="instavisionCardWithBorder">
            {renderNavItem(nav)}
          </MuiCard>
        )
      )}
    </List>
  );

  return (
    <Drawer
      sx={{
        padding: '0px 20px 20px',
        backgroundColor: '#F1F1F1',
        width: drawerWidth,
        flexShrink: 0,
        top: '60px',
        '& .MuiDrawer-paper': {
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#F1F1F1',
          width: drawerWidth,
          padding: '0px 20px 20px',
          top: isMobile ? 60 : 0
        }
      }}
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
      open={openSideBar}
    >
      <SideBarNav>{list()}</SideBarNav>
      <Box width="100%" sx={{ m: '0', padding: '0' }}>
        <LanguageSelector />
      </Box>
    </Drawer>
  );
}

export default SideBar;
