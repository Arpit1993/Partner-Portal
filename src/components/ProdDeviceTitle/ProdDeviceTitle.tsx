import { Typography } from '@mui/material';
import CardWithShadow from 'core-components/CardWithShadow';
import styled from '@emotion/styled';
import DeviceImage from 'assets/new-assets/device.svg';

const LeftContainer = styled('aside')`
  flex-grow: 1;
  text-align: center;
`;

const RightContainer = styled('section')`
  flex-grow: 2;
  width: 100%;
  padding-top: 12px;
`;

function ProdDeviceTitle() {
  return (
    <CardWithShadow
      sx={{
        display: 'flex',
        padding: '32px',
        gap: '32px',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      <LeftContainer>
        <img
          src={DeviceImage}
          width="100"
          height="100"
          alt="Device"
          style={{ borderRadius: '12px' }}
        />
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
          ENG Security
        </Typography>
      </RightContainer>
      <RightContainer style={{ width: '100%', textAlign: 'left' }}>
        <div
          style={{
            margin: 'auto',
            padding: '20px',
            width: '198px',
            borderRadius: '30px',
            background: '#F35D1D',
            color: 'white',
            fontSize: '16px',
            textAlign: 'center'
          }}
        >
          Live
        </div>
      </RightContainer>
    </CardWithShadow>
  );
}

export default ProdDeviceTitle;
