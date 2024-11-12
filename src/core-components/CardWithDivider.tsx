/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-named-default
import { default as MuiCard, CardProps } from '@mui/material/Card';
import { Divider } from '@mui/material';
import styled from '@emotion/styled';

const ModifiedCardWithDivider = styled(MuiCard)`
background: linear-gradient(rgba(241, 241, 241, 1),rgba(241, 241, 241, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box,
border: 1px solid transparent,
`;
interface ICardWithDividerProps extends CardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}

function CardWithDivider(props: ICardWithDividerProps) {
  const { children, ...restOfProps } = props;
  if (!children) {
    return <template />;
  }
  return (
    <ModifiedCardWithDivider
      variant="instavisionCardWithBorder"
      {...restOfProps}
    >
      {children.map((child: any, index: number) => {
        return (
          <>
            {child}
            {index !== children.length - 1 ? (
              <Divider
                variant="middle"
                sx={{ borderColor: 'dividerColor.main', m: '0px' }}
              />
            ) : null}
          </>
        );
      })}
    </ModifiedCardWithDivider>
  );
}

export default CardWithDivider;
