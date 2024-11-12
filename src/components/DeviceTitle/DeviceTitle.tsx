import { Typography } from '@mui/material';
import CardWithShadow from 'core-components/CardWithShadow';
import styled from '@emotion/styled';
import DeviceImagePlaceholder from 'assets/new-assets/noDevicePlaceholderImage.png';
// import DeviceImage from 'assets/new-assets/device.svg';

const LeftContainer = styled('aside')`
  flex-grow: 1;
  text-align: center;
`;

const RightContainer = styled('section')`
  flex-grow: 2;
  width: 100%;
  padding-top: 12px;
`;

interface DeviceModelHeadingProps {
  modelName: string;
  photoURL: string;
}

function DeviceTitle(props: DeviceModelHeadingProps) {
  const { modelName, photoURL } = props;
  return (
    <CardWithShadow
      sx={{
        display: 'flex',
        padding: '32px',
        gap: '32px',
        alignItems: 'center'
      }}
    >
      <LeftContainer>
        {photoURL && (
          <img
            src={photoURL || DeviceImagePlaceholder}
            width="100"
            height="100"
            alt="Device"
            style={{ borderRadius: '12px' }}
          />
        )}
      </LeftContainer>
      <RightContainer>
        <Typography variant="body1" color="text.body">
          Model Name
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontWeight: '600',
            fontSize: '42px',
            textAlign: 'left',
            marginTop: '4px'
          }}
        >
          {modelName}
        </Typography>
      </RightContainer>
    </CardWithShadow>
  );
}

export default DeviceTitle;
