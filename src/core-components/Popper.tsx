/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import Popover from '@mui/material/Popover';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const InstavisionButton = styled('button')(() => ({
  textAlign: 'center',
  boxShadow: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  '&:focus': {
    outline: 'none'
  }
}));

export default function InstaPopper(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { disablePopperProp, children, ...restOfProps } = props;
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <InstavisionButton
        type="button"
        onClick={handleClick}
        disabled={disablePopperProp}
      >
        <MoreVertIcon />
      </InstavisionButton>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        anchorEl={anchorEl}
        id={id}
        onClose={handleClose}
        {...restOfProps}
      >
        <Box
          sx={{
            background: '#EDEDED',
            borderRadius: '4px',
            padding: '8px',
            cursor: 'pointer'
          }}
        >
          {children}
        </Box>
      </Popover>
    </>
  );
}
