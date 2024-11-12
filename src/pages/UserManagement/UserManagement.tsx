import AddUser from 'components/AddUser/AddUser';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import UserDetails from 'components/UserDetails/UserDetails';
import Button from 'core-components/Button';
import { getOemUsers, addOemUser } from 'data/api/zeus';
import { IAddOEMUserRequest } from 'types/request/zeus/userTypes';
import { getOemAndUserId } from 'utils';
import { AlertColor } from '@mui/material';
import InstaSnackBar from 'components/SnackBar';

const MainContainer = styled('main')``;

const AddUserFormButton = styled(Button)`
  width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
`;

function UserManagement() {
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [isAddingUserLoading, setIsAddingUserLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const { oem_id, user_id } = getOemAndUserId();

  const fetchOemUsers = async () => {
    setUsersList([]);
    try {
      setIsLoading(true);
      const userResponse = await getOemUsers(oem_id);
      setUsersList(userResponse?.users);
      setIsLoading(false);
    } catch (error) {
      console.log('Error loading user list', error);
      setIsLoading(false);
    }
  };
  const handleOpenAddUserModal = () => {
    setOpenAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Reset the snackbar open state
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddUserButtonClick = async (formData: IAddOEMUserRequest) => {
    try {
      setIsAddingUserLoading(true);
      const response = await addOemUser(oem_id, formData);
      console.log('response', response);
      // Show success message
      setSeverity('success');
      setSnackbarMessage('User has been successfully created.');
      setSnackbarOpen(true);
      fetchOemUsers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Error Handling for 400 and Other Status Codes
      if (error.response?.status === 400) {
        // both these errors have different resonse body therefore different variables are used
        const errorForInvalidEmail = error.response?.data?.details;
        const errorForAlreadyExistingEmail = error.response?.data?.message;
        if (errorForInvalidEmail && errorForInvalidEmail.length > 0) {
          const errorMessageInvalidEmail = errorForInvalidEmail
            .map((detail: { message: string }) => detail.message)
            .join(', ');
          setSnackbarMessage(
            `User creation failed: ${errorMessageInvalidEmail}`
          );
        } else if (
          errorForAlreadyExistingEmail &&
          errorForAlreadyExistingEmail.length > 0
        ) {
          setSnackbarMessage(
            `User creation failed: ${errorForAlreadyExistingEmail}`
          );
        }
        setSeverity('error');
        setSnackbarOpen(true);
      } else if (error.response?.status === 401) {
        setSnackbarMessage(
          'Authorization failed: Please check your credentials.'
        );
        setSnackbarOpen(true);
      } else if (error.response?.status === 500) {
        setSeverity('error');

        setSnackbarMessage('Server error: Please try again later.');
        setSnackbarOpen(true);
      } else {
        setSeverity('error');
        setSnackbarMessage('An unexpected error occurred. Please try again.');
        setSnackbarOpen(true);
      }
    } finally {
      setIsAddingUserLoading(false);
      setOpenAddUserModal(false);
    }
  };

  useEffect(() => {
    fetchOemUsers();
    handleSnackbarClose();
  }, []);

  return (
    <MainContainer>
      <header style={{ textAlign: 'right' }}>
        <AddUserFormButton
          label="Add User"
          handleClick={handleOpenAddUserModal}
          sx={{ fontSize: '16px', marginBottom: '24px' }}
        >
          Add User
        </AddUserFormButton>
        <AddUser
          openModal={openAddUserModal}
          onCloseClick={handleCloseAddUserModal}
          onAddButtonClick={handleAddUserButtonClick}
          isAddingUserLoading={isAddingUserLoading}
        />
      </header>

      <UserDetails
        users={usersList}
        isLoading={isLoading}
        fetchOemUsers={fetchOemUsers}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarOpen={setSnackbarOpen}
        setSeverity={setSeverity}
        userId={user_id}
      />
      {snackbarOpen && (
        <InstaSnackBar
          message={snackbarMessage}
          severity={severity}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
        />
      )}
    </MainContainer>
  );
}

export default UserManagement;
