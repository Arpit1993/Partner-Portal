// eslint-disable-next-line import/no-named-default
import { default as MuiCard, CardProps } from '@mui/material/Card';

interface ICardProps extends CardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}
function Card(props: ICardProps) {
  const { children, ...restOfProps } = props;
  return (
    <MuiCard variant="instavision" {...restOfProps}>
      {children}
    </MuiCard>
  );
}

export default Card;
