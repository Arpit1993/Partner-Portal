import { Chip, Typography } from '@mui/material';
import CardWithShadow from 'core-components/CardWithShadow';
import CardWithDivider from 'core-components/CardWithDivider';
import styled from '@emotion/styled';
import DeviceImage from 'assets/new-assets/device.svg';

import Arrow from 'assets/new-assets/arrow.svg';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CoreButton from 'core-components/Button';
import { useNavigate } from 'react-router-dom';

const LeftContainer = styled('aside')`
  flex-grow: 1;
  width: 200px;
`;

const RightContainer = styled('section')`
  flex-grow: 2;
  width: 100%;
`;

const DeviceTitle = styled('header')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const DisplayText = styled('div')`
  margin: 0px;
`;

const ImageContainer = styled('div')`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background: #fff;
`;

const EditModel = styled('div')`
  position: absolute;
  bottom: 0;
  width: inherit;
  padding: 16px 0px;
  text-align: center;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  color: rgba(67, 137, 225, 1);
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 4px 1px 21px 0px rgba(111, 114, 115, 0.15);
`;

const CustomButton = styled(Button)(() => ({
  width: '48px',
  minWidth: '48px',
  minHeight: '48px',
  borderRadius: '50%',
  cursor: 'pointer',
  background:
    'linear-gradient(113deg,rgba(228, 228, 228, 1), rgba(241, 241, 241, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
  border: '1px solid transparent',
  transition: 'background 0.3s, transform 0.3s',

  '&:hover': {
    background:
      'linear-gradient(113deg,rgba(210, 210, 210, 1), rgba(220, 220, 220, 1)) padding-box, linear-gradient(356.14deg, #D5D5D5 9.39%, #FFFFFF 88.07%) border-box',
    transform: 'scale(1.1)'
  },
  '&:focus': {
    outline: 'none'
  },
  '&:active': {
    transform: 'scale(0.95)'
  }
}));

const DeviceSpecifications = styled(CardWithDivider)(() => ({}));

interface IDeviceDetails {
  label: string;
  value: string;
}

const ArrowButtonContainer = styled('div')`
  margin-top: 24px;
  text-align: right;
`;

function ProdDeviceFiles() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const deviceDetails: IDeviceDetails[] = [
    { label: 'Resolution', value: 'Full HD' },
    { label: 'Night Vision', value: '2 Way' },
    { label: 'Bluetooth', value: 'icon' },
    { label: 'Working Humidity', value: 'Support cloud storage for TUYA' },
    { label: 'PTZ', value: 'Yes Ron:355 150' },
    { label: 'Wi-Fi', value: '24GHz' },
    { label: 'Mini. Illumination', value: '0 Lux (with infrared led on)' },
    { label: 'Power', value: 'Wired' },
    { label: 'Image Sensor', value: '2MP Color CMOS' },
    { label: 'Display Resolution', value: '1080p(1920*1080)' },
    { label: 'Lens Type', value: 'High definition lens' },
    { label: 'Viewing Angle', value: '105(d)/80(H)' },
    { label: 'Focal Length', value: '4.00mm' },
    { label: 'IR LED', value: 'Red' },
    { label: 'IR Distance', value: '2 Way' },
    { label: 'Day Night Mode', value: 'icon' },
    { label: 'Image Compression', value: 'Yes Ron:355 150' },
    { label: 'Image Frame Rate', value: '24GHz' },
    { label: 'Input/Output', value: 'Full HD' },
    { label: 'Audio Compression', value: '2 Way' },
    { label: 'Wireless Security', value: 'icon' },
    { label: 'Frequency', value: 'Blue' },
    { label: 'Reset', value: 'yes' },
    { label: 'Indicator Light', value: 'Blue' },
    { label: 'Motion Detection', value: 'yes' },
    { label: 'DC', value: 'Blue' },
    { label: 'Battery', value: '5 m' },
    { label: 'Battery Size', value: '5V/1A' },
    { label: 'Micro SD Card(TF Card)', value: 'On' },
    { label: 'Cloud', value: 'On' },
    { label: 'Working Temperature', value: 'Max. Support 256' },
    { label: 'Storage Temperature', value: '-10C to 60C' },
    { label: 'Storage Humidity', value: '20% to 95% non-condensing' },
    { label: 'Wall Mount Sets', value: 'Icon' }
  ];

  const ArrowIcon = styled('img')<{ rotate: boolean }>`
    transition: transform 0.3s ease; /* Smooth transition for rotation */
    transform: ${({ rotate }) => (rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
  `;

  function createElem(list: IDeviceDetails[] = []) {
    return list.map((element) => {
      if (element) {
        return (
          <DisplayText
            style={{ display: 'flex', justifyContent: 'space-between' }}
            key={element.label}
          >
            <Typography
              variant="body2"
              style={{ fontWeight: '500', padding: '20px' }}
            >
              {element.label}
            </Typography>
            <Typography
              variant="body2"
              color="text.title"
              style={{ padding: '20px', opacity: '0.5', fontWeight: '500' }}
            >
              {element.value}
            </Typography>
          </DisplayText>
        );
      }
      return null;
    });
  }

  return (
    <CardWithShadow sx={{ display: 'flex', padding: '32px', gap: '32px' }}>
      <LeftContainer>
        <ImageContainer>
          <img src={DeviceImage} width="200px" height="200px" alt="Device" />
          <EditModel>Edit</EditModel>
        </ImageContainer>

        <Typography
          variant="h3"
          sx={{
            marginTop: '24px',
            display: showMore ? '' : 'none',
            fontWeight: '600',
            textAlign: 'left',
            transition: 'all 0.5s ease'
          }}
        >
          ENG Security
        </Typography>
        <Chip
          label="Security"
          sx={{
            width: '200px',
            height: '36px',
            color: 'primary.main',
            bgcolor: '#fff',
            marginTop: '24px',
            transition: 'all 0.5s ease'
          }}
        />
        <Chip
          label="Live"
          sx={{
            width: '200px',
            height: '36px',
            color: '#fff',
            bgcolor: 'secondary.main',
            marginTop: '12px',
            transition: 'all 0.5s ease',
            display: showMore ? '' : 'none'
          }}
        />
      </LeftContainer>
      <RightContainer>
        <DeviceTitle
          style={{
            display: showMore ? 'none' : '',
            transition: 'all 0.5s ease'
          }}
        >
          <Typography variant="h3">ENG Security</Typography>
        </DeviceTitle>
        <DeviceTitle
          style={{
            display: showMore ? 'flex' : 'none',
            transition: 'all 0.5s ease'
          }}
        >
          <DeviceTitle style={{ margin: 'auto 0' }}>
            <Chip
              label="Image"
              sx={{
                width: '92px',
                height: '36px',
                color: 'primary.main',
                bgcolor: '#fff',
                textAlign: 'center',
                marginRight: '24px',
                transition: 'all 0.5s ease'
              }}
            />
            <Chip
              label="Sound"
              sx={{
                width: '92px',
                height: '36px',
                color: 'primary.main',
                bgcolor: '#fff',
                textAlign: 'center',
                transition: 'all 0.5s ease'
              }}
            />
          </DeviceTitle>
          <CoreButton
            label="Manage Firmware and DID"
            handleClick={() => navigate('/prod-firmware')}
            style={{ fontSize: '16px', padding: '12px 0px', width: '300px' }}
          >
            Manage Firmware
          </CoreButton>
        </DeviceTitle>
        <DeviceSpecifications>
          {createElem(showMore ? deviceDetails : deviceDetails.slice(0, 6))}
        </DeviceSpecifications>
        <ArrowButtonContainer>
          <CustomButton
            disableRipple
            onClick={() => setShowMore(!showMore)}
            sx={{ transition: 'all 0.5s ease' }}
          >
            <ArrowIcon
              src={Arrow}
              alt="drop-down-arrow"
              width="24px"
              height="24px"
              rotate={showMore}
              style={{ transition: 'all 0.5s ease' }}
            />
          </CustomButton>
        </ArrowButtonContainer>
      </RightContainer>
    </CardWithShadow>
  );
}

export default ProdDeviceFiles;
