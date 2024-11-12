import CoreModal from 'core-components/Modal/Modal';
import Button from 'core-components/Button';
import {
  Typography,
  MenuItem,
  FormControl,
  Button as ButtonMui,
  InputLabel
} from '@mui/material';
import CardWithDivider from 'core-components/CardWithDivider';
import styled from 'styled-components';
// import Input from 'core-components/Input';
import PlainSelect from 'core-components/PlainSelect';
import CrossIcon from 'assets/new-assets/cross.svg';
import { Formik } from 'formik';
import InstaTextField from 'core-components/TextField';
import { USER_ROLES } from 'enums';
import * as Yup from 'yup';

const EditUserButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 20px;
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

const FormField = styled('div')`
  width: 400px;
  padding: 12px;
`;

const UserFormInput = styled(InstaTextField)`
  padding: 12px;
  background: transparent;
`;

const UserRoleSelect = styled(PlainSelect)``;

const validationSchema = Yup.object().shape({
  first_name: Yup.string().trim().required('First name is required'),
  last_name: Yup.string().trim().required('Last name is required')
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditUser(props: any) {
  const {
    openModal,
    closeModal,
    onEditButtonClick,
    userData,
    isEditingUserLoading
  } = props;

  const normalizeSpaces = (str: string) => str.replace(/\s+/g, ' ').trim();

  return (
    <CoreModal
      open={openModal}
      onClose={closeModal}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
            // ...slotProps?.backdrop?.sx // Merge the sx object so user-defined styles override defaults
          }
        }
      }}
    >
      <>
        <Header>
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              marginBottom: '40px',
              textAlign: 'center'
            }}
          >
            Edit User
          </Typography>
          <CrossImage src={CrossIcon} alt="cross" onClick={closeModal} />
        </Header>
        <Formik
          initialValues={{
            first_name: userData?.name?.first || '',
            last_name: userData?.name?.last || ''
          }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            setTouched({
              first_name: true,
              last_name: true
            });
            const formattedValues = {
              first_name: normalizeSpaces(values.first_name),
              last_name: normalizeSpaces(values.last_name)
            };
            onEditButtonClick(formattedValues);
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <CardWithDivider
                sx={{ marginBottom: '28px', overflow: 'visible' }}
              >
                <FormField>
                  <UserFormInput
                    fullWidth
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    label="First Name *"
                    value={values.first_name}
                    onChange={handleChange}
                    variant="standard"
                    type="text"
                    error={touched?.first_name && Boolean(errors?.first_name)}
                    inputProps={{ maxLength: 50 }}
                    helperText={
                      errors?.first_name ? String(errors?.first_name) : ''
                    }
                  />
                </FormField>
                <FormField>
                  <UserFormInput
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    label="Last Name *"
                    type="text"
                    value={values.last_name}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    error={touched?.last_name && Boolean(errors?.last_name)}
                    inputProps={{ maxLength: 50 }}
                    helperText={
                      errors?.last_name ? String(errors?.last_name) : ''
                    }
                  />
                </FormField>

                <FormField>
                  <UserFormInput
                    id="Email"
                    name="Email"
                    placeholder="Email"
                    label="Email"
                    type="email"
                    value={userData?.email}
                    fullWidth
                    required
                    disabled
                    variant="standard"
                    InputProps={{
                      sx: {
                        '&.Mui-disabled': {
                          '&:before': {
                            borderBottom: 'none' // Ensure no underline when disabled
                          },
                          '&:after': {
                            borderBottom: 'none' // Ensure no underline when focused
                          }
                        }
                      }
                    }}
                  />
                </FormField>
                {/* <FormField>
                  <UserFormInput
                    id="phone.number"
                    name="phone.number"
                    placeholder="Phone Number"
                    value={values.phone.number}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="string"
                  />
                </FormField> */}
                <FormControl fullWidth>
                  <InputLabel
                    id="userRole"
                    sx={{
                      top: '6px',
                      marginTop: '12px'
                    }}
                  >
                    User Role *
                  </InputLabel>
                  <UserRoleSelect
                    labelId="userRole"
                    id="role"
                    name="role"
                    value={userData?.role}
                    onChange={handleChange}
                    sx={{
                      paddingTop: '12px'
                    }}
                    fullWidth
                    disabled
                  >
                    {userData?.role === USER_ROLES.OEM_SUPER_ADMIN && (
                      <MenuItem value="SuperAdmin">Super Admin</MenuItem>
                    )}
                    <MenuItem value="Viewer">Viewer</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </UserRoleSelect>
                </FormControl>
              </CardWithDivider>
              <EditUserButton
                label="Save"
                type="submit"
                handleClick={() => console.log('Edit User Submit Button')}
                sx={{ fontSize: '16px' }}
                disabled={isEditingUserLoading}
                isLoading={isEditingUserLoading}
              >
                Save
              </EditUserButton>
              <CancelButton
                disableRipple
                onClick={closeModal}
                disabled={isEditingUserLoading}
                sx={{ color: 'secondary.main', fontSize: '16px' }}
                style={{ background: 'transparent', marginTop: '10px' }}
              >
                Cancel
              </CancelButton>
            </form>
          )}
        </Formik>
      </>
    </CoreModal>
  );
}

export default EditUser;
