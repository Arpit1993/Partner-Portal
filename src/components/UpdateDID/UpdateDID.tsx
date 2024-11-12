import { useState } from 'react';
import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography, Button as ButtonMui } from '@mui/material';
import CardWithDivider from 'core-components/CardWithDivider';
import styled from 'styled-components';
import Input from 'core-components/Input';
import CrossIcon from 'assets/new-assets/cross.svg';
import MuiCard from '@mui/material/Card';
import InstavisionCheckbox from 'core-components/Checkbox';

const UploadDatasheetButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
`;

const UploadDatasheetFormButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
`;

const FormField = styled('div')`
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const FormInput = styled(Input)`
  padding: 12px;
`;

const Header = styled('header')`
  text-align: center;
  position: relative;
`;

const CrossImage = styled('img')`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const CancelButton = styled(ButtonMui)`
  padding: 12px 0px;
  border: none;
  width: 100%;
  font-size: 20px;
  borderradius: 50%;
  transition: all 0.9s ease;

  &:hover {
    border: none;
    font-weight: 600;
  }

  &:active {
    border: none;
    outline: none;
    font-weight: 600;
  }
`;

function UploadDatasheet() {
  const [selectedValue, setSelectedValue] = useState<number | string>(0);
  // const { list } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const list = [
    {
      label: '1234 ABCD',
      value: 1
    },
    {
      label: '234 ABCD',
      value: 2
    },
    {
      label: '34 ABCD',
      value: 3
    },
    {
      label: '4 ABCD',
      value: 4
    },
    {
      label: '5 ABCD',
      value: 5
    }
  ];
  const handleButtonClick = () => {
    console.log('Button clicked');
    handleOpen();
  };
  const handleDidClick = (value: number | string) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <UploadDatasheetFormButton
        label="Update DIDs"
        handleClick={handleButtonClick}
        sx={{ fontSize: '16px', color: 'text.title', fontWeight: '500' }}
      >
        Update DIDs
      </UploadDatasheetFormButton>
      <CoreModal open={open} onClose={handleClose}>
        <div style={{ width: 500 }}>
          <Header>
            <Typography
              variant="h3"
              sx={{
                fontWeight: '500',
                marginBottom: '40px',
                textAlign: 'center'
              }}
            >
              UpdateDIDs
            </Typography>
            <CrossImage src={CrossIcon} alt="cross" onClick={handleClose} />
          </Header>
          <MuiCard variant="instavisionCardWithBorder">
            <FormField onClick={() => handleDidClick('all')}>
              <FormInput placeholder="Forced OTA all" />
              <InstavisionCheckbox checked={selectedValue === 'all'} />
            </FormField>
          </MuiCard>
          <CardWithDivider sx={{ margin: '24px 0px' }}>
            {list.map((item) => {
              return (
                <FormField
                  key={item?.value}
                  onClick={() => handleDidClick(item?.value)}
                >
                  <FormInput placeholder={item?.label} />
                  <InstavisionCheckbox
                    checked={selectedValue === item?.value}
                  />
                </FormField>
              );
            })}
          </CardWithDivider>
          <UploadDatasheetButton
            label="Update"
            handleClick={handleButtonClick}
            sx={{ fontSize: '16px' }}
          >
            Update
          </UploadDatasheetButton>
          <CancelButton
            disableRipple
            onClick={handleClose}
            sx={{ color: 'secondary.main', fontSize: '16px' }}
            style={{ background: 'transparent', marginTop: '10px' }}
          >
            {' '}
            Cancel{' '}
          </CancelButton>
        </div>
      </CoreModal>
    </div>
  );
}

export default UploadDatasheet;
