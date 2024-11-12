import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import styled from '@emotion/styled';
import Sheild from 'assets/new-assets/shieldTick.svg';

interface ImageDetails {
  label: string;
  imgPath: string;
}
const images: ImageDetails[] = [
  {
    label: 'San Fransisco',
    imgPath:
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    label: 'Bird',
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    label: 'Bali, Indonesia',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250'
  },
  {
    label: 'Goč, Serbia',
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60'
  }
];
const NavButton = styled(Button)(() => ({
  minWidth: '28px',
  borderRadius: '50%',
  cursor: 'pointer',
  color: '#fff',
  background:
    'linear-gradient(113deg,rgba(255, 255, 255, 0.5),rgba(255,255,255,0.6))',
  border: '1px solid transparent',
  transition: 'background 0.3s, transform 0.3s',

  '&:hover': {
    background:
      'linear-gradient(113deg,rgba(255, 255, 255, 0.6),rgba(255,255,255,0.6))',
    transform: 'scale(1.1)'
  },
  '&:focus': {
    outline: 'none'
  },
  '&:active': {
    transform: 'scale(0.95)'
  }
}));

function ImageCarousel() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const ImageFrame = styled('div')``;

  const ShieldIcon = styled('img')``;

  const DeviceImage = styled('img')``;

  return (
    <ImageFrame
      style={{
        maxWidth: '200px',
        maxHeight: '200px',
        overflow: 'hidden',
        borderRadius: '24px',
        position: 'relative'
      }}
    >
      <ShieldIcon
        src={Sheild}
        alt="Security"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '24px'
        }}
      />
      <DeviceImage
        src={images[activeStep].imgPath}
        alt={images[activeStep].label}
        style={{ borderRadius: '24px', width: '200px', height: '200px' }}
      />
      <MobileStepper
        steps={maxSteps}
        activeStep={activeStep}
        sx={{
          '& .css-1t3iah3-MuiMobileStepper-dot': {
            background: 'white'
          },
          '& .css-20kdqk-MuiButtonBase-root-MuiButton-root': {
            minWidth: '28px',
            width: '28px',
            height: '28px',
            background: 'rgba(255,255,255,0.4)'
          }
        }}
        style={{ position: 'absolute', zIndex: 1, background: 'transparent' }}
        nextButton={
          <NavButton
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </NavButton>
        }
        backButton={
          <NavButton
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </NavButton>
        }
      />
    </ImageFrame>
  );
}

export default ImageCarousel;
