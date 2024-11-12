import { List } from '@mui/material';
import { getNavigationData } from './NavigationData';
import SidebarItem from './sideBarItem';

export function NavList() {
  const navigationData = getNavigationData();
  return (
    <List>
      {navigationData
        .filter((x) => !x.hidden)
        .map((nav) => (
          <SidebarItem key={nav.name} item={nav} />
        ))}
    </List>
  );
}
