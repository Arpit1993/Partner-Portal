import React, { useEffect, useState } from 'react';
import { Typography, Menu, MenuItem, Tooltip, Button } from '@mui/material';
import { getItemFromLocalStorage, logout } from 'utils/index';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import { IsMobile } from 'hooks/isMobile';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Flex } from 'styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOemDetails } from 'data/api/zeus';

const TopBarContainer = styled.div<{ isMobile?: boolean }>`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${IsMobile() ? '100%' : ''};
`;

const TopBarHeading = styled.div`
  font-size: 30px;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: -0.68px;
`;

const HamburgerContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomButton = styled(Button)(() => ({
  cursor: 'pointer',
  background:
    'linear-gradient(113deg,rgba(228, 228, 228, 1), rgba(241, 241, 241, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
  border: '1px solid transparent',
  transition: 'background 0.3s, transform 0.3s',

  '&:hover': {
    background:
      'linear-gradient(113deg,rgba(210, 210, 210, 1), rgba(220, 220, 220, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
    transform: 'scale(1.1)'
  },
  '&:focus': {
    outline: 'none'
  },
  '&:active': {
    transform: 'scale(0.95)'
  }
}));

type IProps = {
  setOpenSideBar: (state: boolean) => void;
  openSideBar: boolean;
};

function TopBar(props: IProps) {
  const [oemName, setOemName] = useState<string>('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { setOpenSideBar, openSideBar } = props;
  const isMobile = IsMobile();
  const first_name = getItemFromLocalStorage('first_name') || '""';
  const last_name = getItemFromLocalStorage('last_name') || '""';
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const location = useLocation();
  const { pathname } = location;

  const firstTwoPartsOfRoute = pathname?.split('/')?.slice(1, 3)?.join('/');
  // console.log('oem_name', oemName);

  // Determine the heading based on the current route
  const getHeading = () => {
    switch (firstTwoPartsOfRoute) {
      case 'engineering/firmware':
        return 'Manage Engineering Firmware & DID';
      case 'production/firmware':
        return 'Manage Production Firmware & DID';
      default:
        // return 'Whale Vision';
        return oemName; // uncomment when api works
    }
  };

  const fetchOemDetails = async () => {
    const oemId: string = getItemFromLocalStorage('oem_id') as string;
    try {
      const response = await getOemDetails(oemId);
      if (response.company.name) {
        setOemName(response.company.name.toUpperCase());
      } else {
        setOemName('OEM PORTAL');
      }
    } catch (error) {
      console.log('Error while fetching OEM details', error);
    }
  };

  useEffect(() => {
    fetchOemDetails();
    getHeading();
    // console.log('in useEffect');
  }, []);

  const handleOpenUserMenu = (event: {
    currentTarget: React.SetStateAction<HTMLElement | null>;
  }) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogOut = async () => {
    try {
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TopBarContainer isMobile={isMobile}>
      {isMobile && (
        <HamburgerContainer>
          {!openSideBar ? (
            <MenuIcon
              onClick={() => setOpenSideBar(true)}
              sx={{ width: 30, height: 30, color: 'white' }}
            />
          ) : (
            <CloseIcon
              onClick={() => setOpenSideBar(false)}
              sx={{ width: 30, height: 30, color: 'white' }}
            />
          )}
        </HamburgerContainer>
      )}
      {!isMobile && <TopBarHeading>{getHeading()}</TopBarHeading>}
      <Flex gap="16px">
        <Typography color="text.title">{`${first_name} ${last_name}`}</Typography>
        <Tooltip title={`${first_name} ${last_name}`}>
          <CustomButton
            onClick={handleOpenUserMenu}
            disableRipple
            sx={{
              transition: 'all 0.5s ease',
              width: '48px',
              height: '48px',
              minWidth: ' 48px',
              borderRadius: '50%',
              color: 'text.body'
            }}
          >
            {first_name?.charAt(0)}
            {last_name?.charAt(0)}
          </CustomButton>
        </Tooltip>
      </Flex>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={onLogOut}>
          <Typography textAlign="center">
            {t('components.topBar.typography')}
          </Typography>
        </MenuItem>
      </Menu>
    </TopBarContainer>
  );
}

export default TopBar;
