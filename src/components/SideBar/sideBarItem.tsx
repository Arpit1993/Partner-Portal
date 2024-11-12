import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavCard from 'components/NavCard/NavCard';
import { NavData } from './NavigationData';
import SidebarSubItem from './SidebarSubItem';

const ListItemWrapper = styled(ListItem)(({ theme, selected }) => ({
  padding: '12px 16px',
  borderRadius: '20px',
  backgroundColor: 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.title,
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out'
}));

type ListItemIconWrapperProps = {
  selected: boolean;
};

const ListItemIconWrapper = styled(ListItemIcon)<ListItemIconWrapperProps>(
  ({ theme, selected }) => ({
    color: selected ? theme.palette.primary.main : theme.palette.text.caption,
    transition: 'all 0.2s ease-in-out',
    padding: 0,
    minWidth: 0,
    width: '24px',
    height: '24px',
    marginBottom: '8px',
    '& svg path': {
      stroke: selected ? theme.palette.primary.main : theme.palette.text.caption
    }
  })
);

function SidebarItem({ item }: { item: NavData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const isActive = useMemo(() => {
    if (item.link) {
      return location.pathname === item.link;
    }
    if (item.subItems) {
      return item.subItems.some(
        (subItem) => location.pathname === subItem.link
      );
    }
    return false;
  }, [location.pathname, item]);

  const [isOpen, setIsOpen] = useState(isActive);

  const handleClick = () => {
    if (item.link) {
      navigate(item.link);
      return;
    }
    if (item.subItems) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <NavCard sx={{ marginBottom: '12px' }}>
      <ListItemWrapper disablePadding onClick={() => handleClick()}>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <ListItemIconWrapper selected={isActive}>
            {item.icon}
          </ListItemIconWrapper>
          <ListItemText
            primary={item.name}
            sx={{
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.title
            }}
          />
        </Box>
        {item.subItems && isOpen && <SidebarSubItem subItems={item.subItems} />}
      </ListItemWrapper>
    </NavCard>
  );
}

export default SidebarItem;
