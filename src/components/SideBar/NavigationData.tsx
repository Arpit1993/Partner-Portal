import { ReactNode } from 'react';
// import { ReactComponent as AppVersionIcon } from 'assets/new-assets/appVersion.svg';
import { ReactComponent as DeviceManagementIcon } from 'assets/new-assets/deviceManagement.svg';
// import { ReactComponent as FirmwareSDKIcon } from 'assets/new-assets/firmwareSDK.svg';
import { ReactComponent as UserManagementIcon } from 'assets/new-assets/userManagement.svg';
import { getItemFromLocalStorage } from 'utils';
import { USER_ROLES } from 'enums';

export type NavData = {
  name: string;
  icon?: ReactNode;
  link?: string;
  hidden?: boolean;
  subItems?: NavData[];
};

export const getNavigationData = (): NavData[] => {
  const userRole = getItemFromLocalStorage('role');
  return [
    {
      name: 'Device Model Management',
      icon: <DeviceManagementIcon />,
      subItems: [
        {
          name: 'Engineering',
          link: '/engineering/device-management'
        },
        {
          name: 'Production',
          link: '/production/device-management'
        }
      ]
    },
    {
      name: 'User Management',
      icon: <UserManagementIcon />,
      link: '/user-management',
      hidden:
        userRole !== USER_ROLES.OEM_SUPER_ADMIN &&
        userRole !== USER_ROLES.OEM_ADMIN
    }
  ];
};
