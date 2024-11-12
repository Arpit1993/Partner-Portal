import RemoveRedEyeSharpIcon from '@mui/icons-material/RemoveRedEyeSharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import LoginScreenImg from 'assets/new-assets/loginScreen.svg';
import logo from 'assets/new-assets/logo.svg';
import LanguageSelector from 'components/LanguageSelector';
import { leftNavData } from 'components/SideBar/SideBar';
import InstaSnackBar from 'components/SnackBar';
import Button from 'core-components/Button';
import CardWithDivider from 'core-components/CardWithDivider';
import Input from 'core-components/Input';
import { loginUser } from 'data/api/zeus';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { parseJwt } from 'utils';
import { setItemInLocalStorage } from 'utils/';

const MainContainer = styled('main')`
  display: flex;
  align-items: center;
  justify-contents: center;
  box-sizing: border-box;
  margin: 0;
  height: 100vh;
  padding: 64px;
`;

const ImageContainer = styled('div')`
  text-align: center;
  padding: 24px 0px;
  img {
    max-width: 100%;
    height: auto;
  }
`;

const RightContainer = styled('div')`
  display: flex;
  flex-grow: 1;
  justify-content: center;
`;
const LoginFormContainer = styled('section')`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 88px;
  overflow: hidden;
  max-width: 700px;
`;

const LoginFormRow = styled('div')`
  display: flex;
  align-items: center;
  padding: 0px 20px;
  height: 70px;
  margin: 0;
`;

const Header = styled('header')`
  text-align: center;
`;
const ForgetPassword = styled('a')`
  color: rgba(67, 137, 225, 1);
  margin-top: -20px;
  text-align: left;
  font-weight: 500;
`;

const LangSelectorContainer = styled('div')`
  text-align: right;
  position: absolute;
  bottom: 40px;
  right: 60px;
`;

function LoginScreen() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.loginScreen'
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();

  const onSignIn = async () => {
    try {
      setIsLoginLoading(true);
      const response = await loginUser(email, password);
      const userData = parseJwt(response.access_token);
      console.log(userData);
      const { oem_id, user_id, role } = userData;
      if (response && response.access_token) {
        setItemInLocalStorage('auth-token', response.access_token);
        setItemInLocalStorage('rt', response.refresh_token);
        setItemInLocalStorage('oem_id', oem_id);
        setItemInLocalStorage('user_id', user_id);
        setItemInLocalStorage('first_name', response.first_name);
        setItemInLocalStorage('last_name', response.last_name);
        setItemInLocalStorage('role', role);
        navigate(`${leftNavData[0]['link']}`);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <MainContainer>
      <ImageContainer>
        <img src={LoginScreenImg} alt="Login Screen Banner" />
        <InstaSnackBar
          message={t('errorMessage')}
          severity="error"
          open={error}
          onClose={() => setError(false)}
        />
      </ImageContainer>
      <RightContainer>
        <LoginFormContainer>
          <Header>
            <img src={logo} width="76px" height="76px" alt="Logo" />
            <Typography
              variant="h1"
              style={{ marginBottom: '40px', fontWeight: '600' }}
            >
              OEM Portal
            </Typography>
            <Typography variant="h2" style={{ fontWeight: '600' }}>
              {t('heading')}
            </Typography>
          </Header>
          <CardWithDivider>
            <LoginFormRow>
              <Input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  width: '100%'
                }}
              />
            </LoginFormRow>
            <LoginFormRow>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                inputProps={{
                  maxLength: 128
                }}
                style={{ fontSize: '18px', fontWeight: '500', width: '100%' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      style={{
                        padding: '0',
                        border: 'none',
                        background: 'none'
                      }}
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    >
                      {showPassword ? (
                        <RemoveRedEyeSharpIcon />
                      ) : (
                        <VisibilityOffSharpIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </LoginFormRow>
          </CardWithDivider>
          <ForgetPassword
            href="/forgotPassword"
            style={{ width: 'fit-content' }}
          >
            {t('forgetPasswordLink')}
          </ForgetPassword>
          <Button
            label={t('signInButton')}
            isLoading={isLoginLoading}
            isDisabled={false}
            style={{ fontSize: '20px', padding: '16px 0px' }}
            disabled={!(email && password)}
            onClick={onSignIn}
          >
            {t('signInButton')}
          </Button>
        </LoginFormContainer>
      </RightContainer>
      <LangSelectorContainer>
        <Box width="100px">
          <LanguageSelector narrow />
        </Box>
      </LangSelectorContainer>
    </MainContainer>
  );
}

export default LoginScreen;
