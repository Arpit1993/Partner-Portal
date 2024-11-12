import { Box, Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { ReactComponent as Cross } from 'assets/new-assets/cross.svg';
import FailureIcon from 'assets/new-assets/failedIcon.svg';
import ForgetPasswordIllustration from 'assets/new-assets/loginScreen.svg';
import logo from 'assets/new-assets/logo.svg';
import SuccessIcon from 'assets/new-assets/successIcon.svg';
import LanguageSelector from 'components/LanguageSelector';
import Button from 'core-components/Button';
import Input from 'core-components/Input';
import { forgotPasswordRequest } from 'data/api/zeus';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IForgotPasswordRequest } from 'types/request/zeus/userTypes';
import { object, ObjectSchema, string } from 'yup';

const MainContainer = styled('main')`
  position: relative;
  display: flex;
  align-items: center;
  justify-contents: space-around;
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

function ForgotPassword() {
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const { t } = useTranslation();

  const [error, setError] = useState(false);

  const handleForgotPasswordFormSubmit = async (
    values: IForgotPasswordRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: any
  ) => {
    // reset states before submitting the form
    setResetPasswordSuccess(false);
    setError(false);

    try {
      const response = await forgotPasswordRequest(values);
      if (response && response.status === 200) {
        setResetPasswordSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error in forgot password API', err);
    } finally {
      actions.setSubmitting(false);
      actions.resetForm();
    }
  };

  const ForgotPasswordFormValidationSchema: ObjectSchema<IForgotPasswordRequest> =
    object({
      email: string()
        .defined()
        .email('views.forgotPassword.email.formatErrorMessage')
        .required('views.forgotPassword.email.helperTextForRequired')
    });

  const defaultValues: IForgotPasswordRequest = {
    email: ''
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: ForgotPasswordFormValidationSchema,
    onSubmit: handleForgotPasswordFormSubmit
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
          <Typography>{t('pages.forgotPassword.successMessage')}</Typography>
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
          <Typography>{t('pages.forgotPassword.errorMessage')}</Typography>
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
                {t('pages.forgotPassword.heading')}
              </Typography>
            </Header>
            <MuiCard variant="instavisionCardWithBorder">
              <FormRow>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('pages.forgotPassword.email')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    width: '100%'
                  }}
                />
              </FormRow>
            </MuiCard>
            <Button
              label={t('pages.forgotPassword.resetPasswordButtonContent')}
              style={{ fontSize: '20px', padding: '16px 0px' }}
              disabled={
                !formik.dirty || formik.isSubmitting || !formik.values.email
              }
              isLoading={formik.isSubmitting}
              type="submit"
            >
              {t('pages.forgotPassword.resetPasswordButtonContent')}
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

export default ForgotPassword;
