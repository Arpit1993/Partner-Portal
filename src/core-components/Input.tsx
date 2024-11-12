// eslint-disable-next-line import/no-named-default
import { default as MuiInput, InputProps } from '@mui/material/Input';

interface InputPropsInterface extends InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}
function Input(props: InputPropsInterface) {
  return <MuiInput {...props} />;
}

export default Input;
