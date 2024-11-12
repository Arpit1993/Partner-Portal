// eslint-disable-next-line import/no-named-default
import { default as MuiCard, CardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const InstavisionCardWithShadow = styled(MuiCard)(() => ({
  background: '#F1F1F1',
  boxShadow: '0px 0px 5px 0px #0000004D'
}));

interface ICardWithShadowProps extends CardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}
function CardWithShadow(props: ICardWithShadowProps) {
  const { children, ...restOfProps } = props;
  return (
    <InstavisionCardWithShadow variant="instavision" {...restOfProps}>
      {children}
    </InstavisionCardWithShadow>
  );
}

export default CardWithShadow;
