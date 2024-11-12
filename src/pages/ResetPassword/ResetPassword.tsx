import Button from 'core-components/Button';
import RemoveRedEyeSharpIcon from '@mui/icons-material/RemoveRedEyeSharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
// import Input from 'core-components/Input';
import InstaTextField from 'core-components/TextField';
import { Typography, Box } from '@mui/material';
import MuiCard from '@mui/material/Card';
import styled from 'styled-components';
import logo from 'assets/new-assets/logo.svg';
import { useTranslation } from 'react-i18next';
import LanguageSelector from 'components/LanguageSelector';
import { useState } from 'react';
import ForgetPasswordIllustration from 'assets/new-assets/loginScreen.svg';
import SuccessIcon from 'assets/new-assets/successIcon.svg';
import FailureIcon from 'assets/new-assets/failedIcon.svg';
import { ReactComponent as Cross } from 'assets/new-assets/cross.svg';
import { useFormik } from 'formik';
import * as yup from 'yup'; // Ensure yup is imported
import { object, string, ObjectSchema } from 'yup';
import { IResetPasswordRequest } from 'types/request/zeus/userTypes';
import { resetPasswordRequest } from 'data/api/zeus';
import { useSearchParams } from 'react-router-dom';
import { retrieveEmailFromResetPasswordQuery } from 'utils';
import CardWithDivider from 'core-components/CardWithDivider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const MainContainer = styled('main')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  margin: 0;
  height: 100vh;
  padding: 64px;
`;
const ImageContainer = styled('div')`
  flex-grow: 2;
  text-align: center;
  img {
    max-width: 800px;
    height: auto;
  }
`;
const RightContainer = styled('div')`
  flex-grow: 3;
  display: flex;
  justify-content: center;
`;
const ForgotPasswordForm = styled('section')`
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 0;
  overflow: hidden;
  min-width: 320px;
  max-width: 400px;
`;
const FormRow = styled('div')`
  display: flex;
  align-items: center;
  padding: 0px 20px;
  height: 70px;
  margin: 0;
`;
const Header = styled('header')`
  text-align: center;
`;
const LangSelectorContainer = styled('div')`
  text-align: right;
  position: absolute;
  bottom: 40px;
  right: 60px;
`;
const StatusMessageCard = styled(MuiCard)`
  padding: 20px;
  width: fit-content;
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  font-size: 16px;
  display: flex;
  align-items: center;
`;
const CrossIcon = styled(Cross)`
  margin-left: 24px;
  cursor: pointer;

  width: 24px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const LoginPageLink = styled('a')`
  color: rgba(67, 137, 225, 1);
  margin-top: -20px;
  text-align: left;
  font-weight: 500;
`;

const FormValidationText = styled('p')`
  margin-top: -20px;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  color: #ff0000;
`;

interface IResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.resetPassword'
  });

  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const emailFromParams: string = retrieveEmailFromResetPasswordQuery();
  const tokenFromParams: string = searchParams.get('token') || '';

  const handleResetPasswordFormSubmit = async (
    values: IResetPasswordFormValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: any
  ) => {
    setResetPasswordSuccess(false);
    setError(false);

    const payload: IResetPasswordRequest = {
      password: values.password,
      email: emailFromParams,
      token: tokenFromParams
    };

    console.log('payload', payload);

    try {
      const response = await resetPasswordRequest(payload);
      if (response && response.status === 200) {
        setResetPasswordSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error in forgot password API', err);
      setError(true);
    } finally {
      actions.setSubmitting(false);
      actions.resetForm();
    }
  };

  // Add yup.ref() for confirmPassword validation
  const ForgotPasswordFormValidationSchema: ObjectSchema<IResetPasswordFormValues> =
    object({
      password: string()
        .min(8, 'Password must be of at least 8 characters')
        .required('Password is required'),
      confirmPassword: string()
        .oneOf(
          [yup.ref('password'), undefined],
          'Password and Confirm Password must match'
        )
        .required('Confirm password is required')
    });

  const defaultValues = {
    password: '',
    confirmPassword: ''
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: ForgotPasswordFormValidationSchema,
    onSubmit: handleResetPasswordFormSubmit
  });

  const handleCloseMessage = () => {
    setResetPasswordSuccess(false);
    setError(false);
  };

  return (
    <MainContainer>
      {resetPasswordSuccess && (
        <StatusMessageCard variant="instavisionCardWithBorder">
          <img
            src={SuccessIcon}
            alt="successIcon"
            style={{ marginRight: '8px', width: '24px' }}
          />
          <Typography>{t('successMessage')}</Typography>
          <CrossIcon onClick={handleCloseMessage} />
        </StatusMessageCard>
      )}
      {error && (
        <StatusMessageCard variant="instavisionCardWithBorder">
          <img
            src={FailureIcon}
            alt="failureIcon"
            style={{ marginRight: '8px', width: '24px' }}
          />
          <Typography>{t('errorMessage')}</Typography>
          <CrossIcon onClick={handleCloseMessage} />
        </StatusMessageCard>
      )}
      <ImageContainer>
        <img
          src={ForgetPasswordIllustration}
          alt="forgetpassword Screen Banner"
        />
      </ImageContainer>
      <RightContainer>
        <form onSubmit={formik.handleSubmit}>
          <ForgotPasswordForm>
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
            <CardWithDivider variant="instavisionCardWithBorder">
              <FormRow>
                <InstaTextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password')}
                  {...formik.getFieldProps('password')}
                  onBlur={formik.handleBlur}
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    maxWidth: '100%'
                  }}
                  variant="standard"
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disableRipple
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                          edge="end"
                          sx={{
                            cursor: 'pointer',
                            border: 'none',
                            '&:hover': {
                              border: 'none'
                            },
                            '&:focus': {
                              border: 'none',
                              outline: 'none'
                            },
                            '&:active': {
                              border: 'none',
                              outline: 'none'
                            }
                          }}
                        >
                          {showPassword ? (
                            <RemoveRedEyeSharpIcon />
                          ) : (
                            <VisibilityOffSharpIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </FormRow>
              <FormRow>
                <InstaTextField
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirmPassword')}
                  {...formik.getFieldProps('confirmPassword')}
                  onBlur={formik.handleBlur}
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    maxWidth: '100%'
                  }}
                  variant="standard"
                  error={Boolean(
                    formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                  )}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disableRipple
                          onClick={() =>
                            setShowConfirmPassword((prevState) => !prevState)
                          }
                          edge="end"
                          sx={{
                            cursor: 'pointer',
                            border: 'none',
                            '&:hover': {
                              border: 'none'
                            },
                            '&:focus': {
                              border: 'none',
                              outline: 'none'
                            },
                            '&:active': {
                              border: 'none',
                              outline: 'none'
                            }
                          }}
                        >
                          {showConfirmPassword ? (
                            <RemoveRedEyeSharpIcon />
                          ) : (
                            <VisibilityOffSharpIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </FormRow>
            </CardWithDivider>
            <FormValidationText>
              {formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ''}
              <br />
              {formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ''}
            </FormValidationText>

            <LoginPageLink href="/login">{t('loginPageLink')}</LoginPageLink>
            <Button
              label={t('resetPasswordButtonContent')}
              style={{ fontSize: '20px', padding: '16px 0px' }}
              disabled={
                !formik.dirty || formik.isSubmitting || !formik.values.password
              }
              type="submit"
            >
              {t('resetPasswordButtonContent')}
            </Button>
          </ForgotPasswordForm>
        </form>
        <LangSelectorContainer>
          <Box width="100px">
            <LanguageSelector narrow />
          </Box>
        </LangSelectorContainer>
      </RightContainer>
    </MainContainer>
  );
}

export default ResetPassword;
