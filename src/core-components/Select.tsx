// eslint-disable-next-line import/no-named-default
import { default as MuiSelect, SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const InstavisionSelect = styled(MuiSelect)(() => ({
  textAlign: 'center',
  boxShadow: 'none',
  '.MuiOutlinedInput-notchedOutline': { border: 0 }
}));
interface ISelectProps extends SelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}
function Select(props: ISelectProps) {
  const { children, ...restOfProps } = props;
  return (
    <InstavisionSelect
      MenuProps={{
        PaperProps: {
          sx: {
            background: '#EDEDED',
            '& .MuiMenuItem-root': {
              padding: 2,
              ':hover': {
                backgroundColor: '#D0D0D0'
              }
            },
            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: '#D0D0D0'
            }
          }
        }
      }}
      {...restOfProps}
    >
      {children}
    </InstavisionSelect>
  );
}

export default Select;
