/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-named-default
import { default as MuiButton, ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { ReactElement } from 'react';

const InstavisionButton = styled(MuiButton)(() => ({
  ':focus': {
    outline: 'none'
  }
}));

interface IButtonProps extends ButtonProps {
  label: string | ReactElement;
  handleClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  children?: any;
}
function Button(props: IButtonProps) {
  const {
    label,
    handleClick,
    isLoading,
    isDisabled = false,
    children,
    ...restOfProps
  } = props;
  return (
    <InstavisionButton
      variant="instavision"
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      {...restOfProps}
    >
      {children}
      {isLoading ? (
        <CircularProgress
          color="inherit"
          size="1rem"
          sx={{ marginLeft: '8px' }}
        />
      ) : null}
    </InstavisionButton>
  );
}

export default Button;
