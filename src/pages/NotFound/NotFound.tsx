import Button from 'core-components/Button';
import { Typography } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotFoundSvg from 'assets/new-assets/notFound.svg';

const MainContainer = styled('main')`
  display: flex;
  align-items: center;
  justify-contents: center;
  box-sizing: border-box;
  margin: 0;
  height: 100vh;
  padding: 48px 120px;
  @media (max-width: 768px) {
    padding: 48px 0px;
    flex-direction: column;
    height: auto;
    gap: 48px;
  }
`;

const ImageContainer = styled('div')`
  flex-grow: 1;
  text-align: center;
  padding: 24px;
  img {
    max-width: 100%;
    height: auto;
  }
`;

const LeftContainer = styled('section')`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 24px;
  overflow: hidden;
  text-align: left;
`;

const DisplayText = styled('div')`
  text-align: left;
`;

function NotFound() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.notFound' });
  const navigate = useNavigate();
  return (
    <MainContainer>
      <LeftContainer>
        <DisplayText>
          <Typography
            variant="body1"
            style={{
              marginBottom: '12px',
              fontWeight: '600',
              color: 'rgba(67, 137, 225, 1)'
            }}
          >
            {t('error')}
          </Typography>
          <Typography
            style={{ marginBottom: '24px', fontSize: '60px' }}
            variant="h1"
          >
            {t('heading')}
          </Typography>
          <Typography
            variant="h3"
            style={{ fontWeight: '400', color: '#475467' }}
          >
            {t('message')}
          </Typography>
        </DisplayText>
        <Button
          label="Go Home"
          handleClick={() => navigate('/engineering/device-management')} // Redirects to the home page
          isDisabled={false}
          style={{ fontSize: '20px', padding: '16px 0px', maxWidth: '180px' }}
        >
          {t('buttonContent')}
        </Button>
      </LeftContainer>
      <ImageContainer>
        <img src={NotFoundSvg} alt="Error 404" />
      </ImageContainer>
    </MainContainer>
  );
}

export default NotFound;
