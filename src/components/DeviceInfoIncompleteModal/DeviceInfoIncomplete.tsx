import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const OkayButton = styled(Button)`
  width: 100%;
  height: 56px;
`;

const Header = styled('header')`
  text-align: center;å
  position: relative;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeviceInfoIncompleteModal(props: any) {
  const {
    openDeviceInfoIncompleteModel,
    handleCloseDeviceInfoIncomplete,
    isImageUploaded,
    isDatsheetUploaded
  } = props;

  const ReturnInfoIncompleteText = () => {
    if (!isImageUploaded && !isDatsheetUploaded)
      return 'Please upload Device Model Image and Datasheet before requesting for review';
    if (!isImageUploaded)
      return 'Please upload Device Model Image before requesting for review';
    if (!isDatsheetUploaded)
      return 'Please upload Datasheet before requesting for review';
    return '';
  };
  return (
    <CoreModal
      open={openDeviceInfoIncompleteModel}
      onClose={handleCloseDeviceInfoIncomplete}
    >
      <div style={{ maxWidth: '320px' }}>
        <Header>
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              marginTop: '36px'
            }}
          >
            Device Model Information Incomplete!
          </Typography>
        </Header>
        <Typography
          variant="body1"
          sx={{
            fontWeight: '400',
            margin: '24px',
            textAlign: 'center'
          }}
        >
          {ReturnInfoIncompleteText()}
        </Typography>
        <OkayButton
          label="Okay"
          handleClick={() => handleCloseDeviceInfoIncomplete()}
          sx={{ fontSize: '16px', color: 'primary.main' }}
          disableRipple
        >
          Okay
        </OkayButton>
      </div>
    </CoreModal>
  );
}

export default DeviceInfoIncompleteModal;
