import { InputLabel, TextField, TextFieldVariants } from '@mui/material';
import { HTMLInputTypeAttribute } from 'react';

export function InputField(props: {
  label: string;
  value: string | number;
  type: HTMLInputTypeAttribute;
  id: string;
  isFullWidth?: boolean;
  variant: TextFieldVariants;
  isDisabled?: boolean;
}) {
  const {
    label,
    value,
    type,
    id,
    isFullWidth = true,
    variant,
    isDisabled = false
  } = props;
  return (
    <>
      <InputLabel htmlFor={id} sx={{ marginTop: '20px' }}>
        {label}
      </InputLabel>
      <TextField
        type={type}
        fullWidth={isFullWidth}
        id={id}
        variant={variant}
        value={value}
        sx={{
          marginBottom: '15px',
          backgroundColor: '#F0F4F4',
          color: '#494141',
          fontWeight: '14px'
        }}
        style={{
          marginBottom: '15px',
          backgroundColor: '#F0F4F4',
          color: '#494141',
          fontWeight: '14px'
        }}
        disabled={isDisabled}
      />
    </>
  );
}
