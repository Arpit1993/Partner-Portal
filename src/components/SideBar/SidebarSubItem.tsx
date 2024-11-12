import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { Box, useTheme } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NavData } from './NavigationData';

function SidebarSubItem({ subItems }: { subItems?: NavData[] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = (link: string) => {
    navigate(link);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {subItems?.map((subItem) => (
        <Box
          key={subItem.name}
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            paddingX: '34px',
            paddingY: '12px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(subItem.link || '');
          }}
        >
          {subItem.link === location.pathname ? (
            <CircleIcon
              sx={{
                fontSize: '8px',
                color:
                  subItem.link === location.pathname
                    ? theme.palette.primary.main
                    : theme.palette.text.caption
              }}
            />
          ) : (
            <CircleOutlinedIcon
              sx={{
                fontSize: '8px',
                color:
                  subItem.link === location.pathname
                    ? theme.palette.primary.main
                    : theme.palette.text.caption
              }}
            />
          )}
          <NavLink
            to={subItem.link || ''}
            onClick={(e) => e.stopPropagation()}
            style={{
              textDecoration: 'none',
              width: '100%',
              color:
                subItem.link === location.pathname
                  ? theme.palette.primary.main
                  : theme.palette.text.body
            }}
          >
            {subItem.name}
          </NavLink>
        </Box>
      ))}
    </Box>
  );
}

export default SidebarSubItem;
