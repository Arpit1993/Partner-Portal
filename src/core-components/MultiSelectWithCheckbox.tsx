/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-named-default
import { Box, Chip, FormControl, ListItemText, MenuItem } from '@mui/material';
import MuiSelect, { SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import InstavisionCheckbox from './Checkbox';

const InstavisionPlainSelect = styled(MuiSelect)(() => ({
  boxShadow: 'none',
  '.MuiOutlinedInput-notchedOutline': { border: 0 },
  '& .MuiSelect-select': {
    background: 'none'
  }
}));
interface Obj {
  label: string;
  value: string | number | boolean;
}

interface ISelectProps extends SelectProps {
  dataList: string[] | Obj[];
  value?: any;
  textKey?: string | keyof Obj;
  valueKey?: string | number;
  onChange?: any;
  id: string;
  name?: string;
  required?: boolean;
  error?: boolean;
}
function MultiSelectWithCheckbox(props: ISelectProps) {
  const {
    id,
    name,
    dataList,
    value,
    valueKey,
    onChange,
    textKey,
    label,
    error,
    required,
    ...restOfProps
  } = props;
  return (
    <FormControl
      required={required}
      error={error}
      fullWidth
      sx={{ m: (theme) => theme.spacing(1, 0) }}
    >
      <InstavisionPlainSelect
        onChange={onChange}
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
        id={id}
        labelId={id}
        inputProps={{ id: id || name, name: name || id }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderValue={(selected: any) => {
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((selectedValue: string) => (
                <Chip key={selectedValue} label={selectedValue} />
              ))}
            </Box>
          );
        }}
        value={value}
        multiple
        {...restOfProps}
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dataList.map((item: any, index: number) => {
            return (
              <MenuItem
                // eslint-disable-next-line react/no-array-index-key
                key={`${index}-${item}`}
                value={valueKey ? item[valueKey] : item}
              >
                <>
                  <InstavisionCheckbox
                    checked={value && value.indexOf(item) > -1}
                  />
                  <ListItemText primary={item} />
                </>
              </MenuItem>
            );
          })
        }
      </InstavisionPlainSelect>
    </FormControl>
  );
}

export default MultiSelectWithCheckbox;
