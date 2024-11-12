/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLInputTypeAttribute } from 'react';
import styled from 'styled-components';

const InputLabel = styled.div`
  color: #484c4f;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.14px;
  margin-bottom: 10px;
  margin-top: 22px;
`;

const InputTextField = styled.input`
  border-radius: 12px;
  background: #f0f4f4;
  width: 100%;
  height: 48px;
  border: none;
  padding: 12px;
  color: #494141;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.14px;
  margin-bottom: 17px;
`;

function InputText(props: {
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  value: string | number;
  type: HTMLInputTypeAttribute;
  isDisabled?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: any) => void;
}) {
  const {
    id,
    label,
    value,
    type,
    isDisabled,
    placeholder,
    name,
    min,
    max,
    onChange
  } = props;
  return (
    <>
      <InputLabel>{label}</InputLabel>
      <InputTextField
        onChange={onChange}
        id={id}
        name={name || ''}
        type={type}
        value={value}
        disabled={isDisabled}
        placeholder={placeholder || ''}
        min={min}
        max={max}
      />
    </>
  );
}

export default InputText;
