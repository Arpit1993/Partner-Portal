// eslint-disable-next-line import/no-named-default
import { default as MuiCard, CardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const NavCardInstavision = styled(MuiCard)(() => ({
  background:
    'linear-gradient(113deg,rgba(228, 228, 228, 1) 13%, rgba(241, 241, 241, 1) 89%,rgba(255, 255, 255, 1) ) padding-box, linear-gradient(356.14deg, #FFFFFF 9.37%, #D5D5D5 88.39%) border-box',
  border: '1px solid transparent',
  borderRadius: '1rem',
  boxShadow: 'none'
}));

interface INavCardProps extends CardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}

function CardWithShadow(props: INavCardProps) {
  const { children, ...otherProps } = props;
  return <NavCardInstavision {...otherProps}>{children}</NavCardInstavision>;
}

export default CardWithShadow;
