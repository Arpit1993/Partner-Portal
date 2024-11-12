import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';

const StyledTextField = styled(TextField)(() => ({
  '&.MuiTextField-root': {
    padding: '0px'
  },
  'input:-internal-autofill-selected': {
    backgroundColor: 'rgba(237, 237, 237, 1)',
    color: 'fieldtext',
    WebkitBoxShadow: '0 0 0 1000px rgba(237, 237, 237, 1) inset' // Prevent autofill color bleeding
  }
}));

export default function InstaTextField(props: TextFieldProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <StyledTextField fullWidth {...props} />;
}
