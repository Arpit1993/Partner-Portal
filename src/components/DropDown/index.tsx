import {
  Box,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  Select,
  MenuItem
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

interface Obj {
  label: string;
  value: string | number | boolean;
}

type IProps = {
  id?: string;
  name?: string; // TODO: refactor this
  label?: string;
  placeholder?: string;
  dataList: string[] | Obj[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  textKey?: string | keyof Obj;
  valueKey?: string | number;
  multiSelect?: boolean;
  onChange?:
    | ((
        event: SelectChangeEvent<string | number | boolean | string[]>,
        child: React.ReactNode
      ) => void)
    | undefined;
  required?: boolean;
  error?: boolean;
};

export default function DropDown(props: IProps) {
  const { t } = useTranslation();
  const {
    id,
    name,
    label,
    placeholder = 'components.dropDown.selectHeading',
    dataList,
    value,
    textKey,
    valueKey,
    multiSelect = false,
    onChange,
    required,
    error
  } = props;

  return (
    <FormControl
      required={required}
      error={error}
      fullWidth
      sx={{ m: (theme) => theme.spacing(1, 0) }}
    >
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <Select
        id={id}
        labelId={id}
        label={label}
        inputProps={{ id: id || name, name: name || id }}
        value={value}
        onChange={onChange}
        multiple={multiSelect}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(multiSelect && {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderValue: (selected: any) => {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((selectedValue: string) => (
                  <Chip key={selectedValue} label={selectedValue} />
                ))}
              </Box>
            );
          }
        })}
      >
        {!multiSelect && (
          <MenuItem disabled value={0} style={{ opacity: '0.8' }}>
            <em style={{ color: '#9CA8B0', fontWeight: 300 }}>
              {t(placeholder)}
            </em>
          </MenuItem>
        )}

        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dataList.map((item: any, index) => (
            <MenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}-${item}`}
              value={valueKey ? item[valueKey] : item}
            >
              {!multiSelect && (textKey ? item[textKey] : item)}
              {multiSelect && (
                <>
                  <Checkbox checked={value && value.indexOf(item) > -1} />
                  <ListItemText primary={item} />
                </>
              )}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}
