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
import styled from '@emotion/styled';
import PlainSelect from 'core-components/PlainSelect';
import CrossIcon from 'assets/new-assets/cross.svg';
import { Formik } from 'formik';
import { IAddOEMUserRequest } from 'types/request/zeus/userTypes';
import InstaTextField from 'core-components/TextField';
import * as Yup from 'yup';

const AddUserButton = styled(Button)`
  width: 100%;
  height: 56px;
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
  padding: 12px;
`;

const UserFormInput = styled(InstaTextField)`
  margin: 0;
`;

const UserRoleSelect = styled(PlainSelect)``;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Please enter a valid email')
    .required('Email is required'),
  name: Yup.object().shape({
    first: Yup.string().trim().required('First name is required'),
    last: Yup.string().trim().required('Last name is required')
  }),
  role: Yup.string().trim().required('Role is required')
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AddUser(props: any) {
  const { openModal, onCloseClick, onAddButtonClick, isAddingUserLoading } =
    props;

  const handleAddUserFormSubmit = (values: IAddOEMUserRequest) => {
    console.log('values', values);
    onAddButtonClick(values);
  };

  const normalizeSpaces = (str: string) => str.replace(/\s+/g, ' ').trim();

  return (
    <CoreModal open={openModal} onClose={onCloseClick}>
      <>
        <Header>
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              margin: '8px 0px 24px 0',
              textAlign: 'center'
            }}
          >
            Add User
          </Typography>
          <CrossImage
            src={CrossIcon}
            alt="cross"
            onClick={() => {
              if (!isAddingUserLoading) {
                onCloseClick();
              }
            }}
          />
        </Header>
        <Formik
          initialValues={{
            name: {
              first: '',
              last: ''
            },
            email: '',
            role: ''
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            setTouched({
              name: { first: true, last: true },
              email: true,
              role: true
            });
            const formattedValues = {
              email: normalizeSpaces(values.email),
              name: {
                first: normalizeSpaces(values.name.first),
                last: normalizeSpaces(values.name.last)
              },
              role: normalizeSpaces(values.role)
            };
            handleAddUserFormSubmit(formattedValues);
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <CardWithDivider
                sx={{
                  display: 'relative',
                  marginBottom: '28px',
                  minWidth: '400px',
                  overflow: 'visible'
                }}
              >
                <FormField>
                  <UserFormInput
                    id="name.first"
                    name="name.first"
                    placeholder="First Name"
                    label="First Name *"
                    value={values.name.first}
                    onChange={handleChange}
                    type="text"
                    variant="standard"
                    error={!!errors?.name?.first && touched?.name?.first}
                    inputProps={{ maxLength: 50 }}
                    helperText={errors?.name?.first}
                    fullWidth
                    sx={{
                      '& .MuiFormControl-root': {
                        margin: 0 // override MUI margin
                      }
                    }}
                  />
                </FormField>
                <FormField>
                  <UserFormInput
                    id="name.last"
                    name="name.last"
                    placeholder="Last Name"
                    label="Last Name *"
                    value={values.name.last}
                    onChange={handleChange}
                    variant="standard"
                    type="text"
                    error={!!errors?.name?.last && touched?.name?.last}
                    inputProps={{ maxLength: 50 }}
                    helperText={errors?.name?.last}
                    sx={{
                      '& .MuiFormControl-root': {
                        margin: 0 // override MUI margin
                      }
                    }}
                  />
                </FormField>
                <FormField>
                  <UserFormInput
                    id="email"
                    name="email"
                    placeholder="Email"
                    label="Email *"
                    value={values.email}
                    variant="standard"
                    onChange={handleChange}
                    // type="email"
                    error={!!errors?.email && touched?.email}
                    helperText={errors?.email}
                    fullWidth
                    sx={{
                      '& .MuiFormControl-root': {
                        margin: 0 // override MUI margin
                      }
                    }}
                  />
                </FormField>
                {/* <FormField>
                  <UserFormInput
                    id="code"
                    name="code"
                    placeholder="Country Code"
                    value={values.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="string"
                    sx={{
                      '& .MuiSelect-select span::before': {
                        color: 'text.title'
                      }
                    }}
                  />
                </FormField> */}
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
                    sx={{
                      '& .MuiSelect-select span::before': {
                        color: 'text.title'
                      }
                    }}
                  />
                </FormField> */}
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel
                    id="role"
                    sx={{
                      top: '4px',
                      marginTop: '12px',
                      color: errors?.role ? '#d32f2f' : '#rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    User Role *
                  </InputLabel>
                  <UserRoleSelect
                    labelId="role"
                    id="role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    sx={{
                      paddingTop: '12px',
                      '& .MuiSelect-select': {
                        padding: errors?.role
                          ? '16.5px 14px 4px 14px'
                          : '16.5px 14px'
                      }
                    }}
                    fullWidth
                    error={!!errors?.email && touched?.email}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </UserRoleSelect>
                  {errors?.role && (
                    <p
                      style={{
                        color: '#d32f2f',
                        fontSize: '12px',
                        paddingLeft: '16px',
                        marginBottom: '4px'
                      }}
                    >
                      {errors?.role}
                    </p>
                  )}
                </FormControl>
              </CardWithDivider>
              <AddUserButton
                label="Add"
                type="submit"
                sx={{ fontSize: '16px' }}
                disabled={isAddingUserLoading}
                isLoading={isAddingUserLoading}
              >
                Add
              </AddUserButton>
              <CancelButton
                disableRipple
                onClick={onCloseClick}
                disabled={isAddingUserLoading}
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

export default AddUser;
